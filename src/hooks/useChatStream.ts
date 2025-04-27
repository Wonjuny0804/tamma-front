import { useState, useRef, useEffect } from "react";
// import { formatForMarkdown } from "@/lib/chat";
import { createParser, EventSourceMessage } from "eventsource-parser";
import { createClient } from "@/lib/supabase/client";

type ToolCall = {
  name: string;
  args: Record<string, unknown>;
  id: string;
  type: "tool_call";
};

/*
'role': 'tool',
                            'content': tool_call_data['args'],
                            'tool_call_id': tool_call_data['id'],
                            'tool_name': tool_call_data['name'],
                            'type': 'tool_message_done'
*/

export type Message = 
{ role: "assistant"; type: "answer"; content: string } |
{ role: "user"; type: "answer" | "question"; content: string} |
{ role: "tool"; type: "tool_message_done" | "tool_message_stream" | "tool_message_result"; content: string; tool_name: string; tool_call_id: string };

const useChatStream = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Hydrate chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("Not logged in");
        }

        const res = await fetch(
          `http://localhost:8000/api/chats/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error(res.statusText);
        const data: { role: string; content: string }[] = await res.json();

        if (data.length > 0) {
          setMessages(
            data.map((m) =>
              m.role === "user"
                ? { content: `${m.content}`, type: "answer", role: "user" }
                : { content: `${m.content}`, type: "answer", role: "assistant" }
            )
          );
        } else {
          setMessages([
            {
              content: "Hello, I'm the AI assistant. How can I help you today?",
              type: "answer",
              role: "assistant",
            },
          ]);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    if (sessionId) loadHistory();
  }, [sessionId]);

  const sendMessage = async (userMessage: string) => {
    if (!sessionId) {
      setError("No session ID");
      return;
    }

    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { content: `${userMessage}`, type: "answer", role: "user" },
    ]);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!user || !session) {
        throw new Error("Not logged in");
      }

      const res = await fetch(`http://localhost:8000/api/chat-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
          user_id: user.id,
        }),
      });
      if (!res.body) throw new Error("No response body");

      // keep outside onEvent so it survives between events

      const parser = createParser({
        onEvent: (event: EventSourceMessage) => {
          // end‑of‑stream sentinel
          if (event.data === "[DONE]") {
            console.log(`Steam complete!`);
            setLoading(false);
            return;
          }

          try {
            console.log(event.data, '\n\n');
            const newChunk = JSON.parse(event.data);

            switch (newChunk.type) {
              case "answer":
                setMessages(prev => {
                  const last = prev[prev.length - 1];

                  if (last && last.role === 'assistant') {
                    const updated = { ...last, content: last.content + newChunk.content };
                    return [...prev.slice(0, -1), updated];
                  } else {
                    const newAssistantMessage: Message = {
                      role: "assistant",
                      content: newChunk.content,
                      type: "answer"
                    };
                    return [...prev, newAssistantMessage];
                  }
                });
                break;
              case "tool_message_stream":
              case "tool_message_result":
                setMessages(prev => {
                  const toolMessage = prev.find(msg => msg.role === 'tool' && msg?.tool_call_id === newChunk.tool_call_id)

                  if (toolMessage && toolMessage.role === 'tool') {
                    const updated = { ...toolMessage, content: toolMessage.content + newChunk.content };
                    return [...prev.slice(0, -1), updated]
                  } else {
                    const newToolMessage: Message = {
                      role: "tool",
                      content: newChunk.content,
                      type: "tool_message_stream",
                      tool_call_id: newChunk.tool_call_id,
                      tool_name: newChunk.tool_name
                    }
                    return [...prev, newToolMessage];
                  }
                })
                break;
              
              case "tool_message_done":
                console.log("tool_message_done type came in!", newChunk)
                // setMessages(prev => [...prev, ]);
                break;
              default:
                console.log(`Different type came in`, newChunk);

            }

          } catch (err) {
            console.error("Error handling stream data:", err, event.data);
          }
        },
        onError: (err) => {
          console.error("SSE parse error:", err);
          setError("Connection error. Please try again.");
          setLoading(false);
        },
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // feed every chunk into the parser
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.feed(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
};

export default useChatStream;
