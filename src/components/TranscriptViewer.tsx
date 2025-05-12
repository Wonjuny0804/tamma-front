// components/TranscriptViewer.tsx
'use client';

import { useEffect, useState } from 'react';

interface Segment {
  start: number;
  end: number;
  text: string;
}

interface Transcript {
  text: string;
  segments: Segment[];
}

export default function TranscriptViewer({ transcriptKey }: { transcriptKey: string }) {
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchTranscript() {
      try {
        const res1 = await fetch(
          `/api/download-url?bucket=derived&key=${encodeURIComponent(transcriptKey)}`
        );
        const { url, error: preErr } = await res1.json();
        if (preErr) throw new Error(preErr);

        const res2 = await fetch(url);
        if (!res2.ok) throw new Error(`Fetch failed: ${res2.status}`);
        const data: Transcript = await res2.json();
        setTranscript(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchTranscript();
  }, [transcriptKey]);

  if (loading) return <p>Loading transcript…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!transcript) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigator.clipboard.writeText(transcript.text)}
        className="rounded bg-blue-500 px-3 py-1 text-white"
      >
        Copy All
      </button>
      <div className="h-96 overflow-y-auto rounded border bg-gray-50 p-4">
        <pre className="whitespace-pre-wrap">{transcript.text}</pre>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-medium">Timestamps</h2>
        <ul className="list-inside list-decimal space-y-1 text-sm">
          {transcript.segments.map((s, i) => (
            <li key={i}>
              {s.start.toFixed(2)}–{s.end.toFixed(2)}: {s.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
