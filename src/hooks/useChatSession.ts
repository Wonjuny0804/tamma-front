// src/hooks/useChatSession.ts
import { useState, useEffect } from "react";

const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/session`, {
          method: "POST",
        });
        const { session_id } = await res.json();
        setSessionId(session_id);
      } catch (e) {
        console.error(e);
        setError("Could not start chat session.");
      }
    };

    fetchSession();
  }, []);

  return { sessionId, error };
};

export default useChatSession;
