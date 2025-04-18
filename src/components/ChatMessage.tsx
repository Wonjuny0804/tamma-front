import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkBreaks from "remark-breaks";

interface ChatMessageProps {
  content: string;
}

const ChatMessage = ({ content }: ChatMessageProps) => {
  const isUser = content.startsWith("🧑:");
  const messageContent = content.slice(content.indexOf(":") + 1).trim();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        } whitespace-pre-wrap break-words`}
      >
        <p className="text-sm font-semibold mb-1">{isUser ? "You" : "AI"}</p>
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
          {messageContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
