"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import useChatStream from "@/hooks/useChatStream";
import useChatSession from "@/hooks/useChatSession";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { sessionId } = useChatSession();
  const { messages, loading, error, sendMessage } = useChatStream(sessionId);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 relative">
      <div className="text-2xl font-bold mb-4">Chat Dashboard</div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Start a conversation…
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} content={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Sending…
            </span>
          ) : (
            "Send"
          )}
        </button>
      </form>

      {/* Logout button - positioned at bottom left */}
      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="absolute bottom-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg text-sm flex items-center"
      >
        {logoutLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Logging out...
          </span>
        ) : (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </span>
        )}
      </button>
    </div>
  );
};

export default Dashboard;
