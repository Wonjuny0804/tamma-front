'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import FileDropzone from '@/components/FileDropzone';
import DownloadLink from '@/components/DownloadLink';
import Link from 'next/link';
import { Job } from '@/types';

const Dashboard = () => {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);

  const onUploadComplete = async (job: Job) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notify-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          s3Key: job.s3_key,
        }),
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  // realtime listener
  useEffect(() => {
    supabase
      .channel('jobs')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jobs' },
        (payload: { new: Job }) => {
          console.log(payload);
          setJobs((j) => j.map((r) => (r.id === payload.new.id ? payload.new : r)));
        }
      )
      .subscribe();
    (async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      setJobs(data as Job[]);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">My Jobs</h1>

      <FileDropzone onUploadComplete={onUploadComplete} />

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j: Job) => (
            <tr key={j.id}>
              <td>{j.file_name}</td>
              <td>{j.file_type === 'audio' ? j.status : j.transcript_status}</td>
              <td className="space-x-2">
                {j.file_type === 'audio' && j.status === 'done' && (
                  <DownloadLink derivedKey={j.derived_key} />
                )}

                {j.file_type === 'video' && j.transcript_status === 'done' && (
                  <Link href={`/job/${j.id}/transcript`} className="text-blue-600 hover:underline">
                    View Transcript
                  </Link>
                )}

                {j.file_type === 'video' && j.clips_status === 'generated' && (
                  <Link href={`/job/${j.id}/clips`} className="text-green-600 hover:underline">
                    Download Clips
                  </Link>
                )}

                {j.clips_status === 'ready' && (
                  <Link
                    href={`/dashboard/clip-suggestions/${j.id}`}
                    className="rounded bg-indigo-500 px-2 py-1 text-white"
                  >
                    View Suggestions
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
