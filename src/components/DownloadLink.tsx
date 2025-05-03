'use client';

import { useState, FC } from 'react';

interface Props {
  derivedKey: string;
}

const DownloadLink: FC<Props> = ({ derivedKey }) => {
  console.log(derivedKey);
  const [url, setUrl] = useState<string | null>(null);

  const fetchUrl = async () => {
    const res = await fetch(`/api/download-url?key=${encodeURIComponent(derivedKey)}`);
    const { url: presignedUrl } = await res.json();
    setUrl(presignedUrl);
  };

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
      Download
    </a>
  ) : (
    <button onClick={fetchUrl} className="text-blue-600 underline">
      Get Download Link
    </button>
  );
};

export default DownloadLink;
