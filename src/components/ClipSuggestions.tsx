import React, { useState } from 'react';

export interface Clip {
  start: number;
  end: number;
  summary: string;
}

interface Props {
  clips: Clip[];
}

const ClipSuggestions: React.FC<Props> = ({ clips }) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (clips.length === 0) {
    return <p>No suggestions—try a longer video.</p>;
  }

  return (
    <ul className="max-h-80 space-y-3 overflow-y-auto">
      {clips.map((c, i) => (
        <li key={i} className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={selected.has(i)}
            onChange={() => toggle(i)}
            className="mt-1"
          />
          <div>
            <p className="font-medium">
              {c.start.toFixed(2)}–{c.end.toFixed(2)} seconds
            </p>
            <p className="text-sm text-gray-700">{c.summary}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ClipSuggestions;
