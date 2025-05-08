'use client';

import { useEffect, useState } from 'react';
import TranscriptViewer from '@/components/TranscriptViewer';
import { Job } from '@/types'; // assume you have a Job interface
import { useParams } from 'next/navigation';

const TranscriptPage = () => {
  const { id } = useParams();
  console.log(id);

  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then(({ job }) => {
        if (!job) throw new Error('Job not found');
        setJob(job);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading job…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!job) return <p>No job data.</p>;

  const { transcript_key } = job;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Transcript for Job {id}</h1>
      <TranscriptViewer transcriptKey={transcript_key} />
    </div>
  );
};

export default TranscriptPage;
