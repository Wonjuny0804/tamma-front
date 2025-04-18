import { useState, useRef, useEffect } from "react";
import { formatForMarkdown } from "@/lib/chat";
import { createParser, EventSourceMessage } from "eventsource-parser";
import { createClient } from "@/lib/supabase/client";

const useChatStream = (sessionId: string | null) => {
  const [messages, setMessages] = useState<string[]>([]);
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

        setMessages(
          data.map((m) =>
            m.role === "user" ? `🧑: ${m.content}` : `🤖: ${m.content}`
          )
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    };

    if (sessionId) loadHistory();
  }, [sessionId]);

  // holds the growing bot answer
  const botRef = useRef<string>("");

  const sendMessage = async (userMessage: string) => {
    if (!sessionId) {
      setError("No session ID");
      return;
    }

    setError(null);
    setLoading(true);
    // push user + blank bot slot
    setMessages((prev) => [...prev, `🧑: ${userMessage}`, "🤖: "]);
    botRef.current = "";

    try {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not logged in");
      }

      const res = await fetch(
        `http://localhost:8000/api/chat-stream?session_id=${sessionId}&message=${encodeURIComponent(
          userMessage
        )}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );
      if (!res.body) throw new Error("No response body");

      // === proper SSE parser usage ===

      const parser = createParser({
        onEvent: (event: EventSourceMessage) => {
          // end‑of‑stream sentinel
          if (event.data === "[DONE]") {
            setLoading(false);
            return;
          }

          // append exactly what the server sent (including any \n\n)
          botRef.current += event.data;

          // immediately re‑render that last “🤖:” message
          setMessages((prev) => [
            ...prev.slice(0, -1),
            `🤖: ${formatForMarkdown(botRef.current)}`,
          ]);
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
