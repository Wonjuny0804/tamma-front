// src/hooks/useChatSession.ts
import { useState, useEffect } from "react";

const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/session`, { method: "POST" })
      .then((res) => res.json())
      .then(({ session_id }) => setSessionId(session_id))
      .catch((e) => {
        console.error(e);
        setError("Could not start chat session.");
      });
  }, []);

  return { sessionId, error };
};

export default useChatSession;
