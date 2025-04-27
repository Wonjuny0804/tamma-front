import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkBreaks from "remark-breaks";
import { Message } from "@/hooks/useChatStream";
import { useState } from "react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isToolMessage = message.role === 'tool';
  const [isCollapsed, setIsCollapsed] = useState(false);
  console.log(message);


  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div onClick={toggleCollapse} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] ${
          isUser ? "bg-blue-500 text-white" : isToolMessage ? "bg-gray-200 text-gray-800" : "bg-gray-200 text-gray-800"
        } break-words`}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-semibold">{isUser ? "You" : "AI"} {message.role === 'tool' ? 'Tool-Call' : ''}</p>
        </div>

        {message.role === 'tool' && 
          <div aria-expanded={isCollapsed} className={`max-h-0 overflow-hidden transition-height duration-1000 ease-in-out aria-expanded:max-h-[1000px]`}>
            <div className={`font-bold`}>Tool Name: {message.tool_name}</div>
            <div>Tool Message:</div>
            <div className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{message.content}</ReactMarkdown>
            </div>
          </div>}

        <div className="prose max-w-none">
          {message.type === "answer" && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <div className="mb-2 rounded-lg overflow-hidden border border-gray-300">
                      <div className="flex justify-between bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        <span>{match[1].toUpperCase()}</span>
                        <button
                          className="copy-button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              String(children).replace(/\n$/, "")
                            );
                          }}
                        >
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark as Record<string, React.CSSProperties>}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
              }}
            >
              {message?.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
