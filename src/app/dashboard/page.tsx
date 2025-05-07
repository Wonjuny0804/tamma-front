'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import FileDropzone from '@/components/FileDropzone';
import DownloadLink from '@/components/DownloadLink';

export interface IJob {
  id: string;
  file_name: string;
  file_type: string;
  s3_key: string;
  status: string;
  derived_key: string;
  transcript_key: string;
  transcript_status: string;
}

export default function Dashboard() {
  const supabase = createClient();

  const [jobs, setJobs] = useState<IJob[]>([]);

  const onUploadComplete = async (job: IJob) => {
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
        (payload: { new: IJob }) => {
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
      setJobs(data as IJob[]);
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
          {jobs.map((j: IJob) => (
            <tr key={j.id}>
              <td>{j.file_name}</td>
              <td>{j.status}</td>
              <td>
                {j.file_type === 'audio' ? (
                  j.status === 'done' ? (
                    <DownloadLink derivedKey={j.derived_key} />
                  ) : null
                ) : j.transcript_status === 'done' ? (
                  <DownloadLink derivedKey={j.transcript_key} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
