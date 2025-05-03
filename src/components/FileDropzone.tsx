import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IJob } from '@/app/dashboard/page';

interface Props {
  /**
   * Optional callback that runs after the upload + DB insert succeed.
   * Receives the `job` row returned by the API route.
   */
  onUploadComplete?: (job: IJob) => Promise<void>;
}

export default function FileDropzone({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];

      try {
        setUploading(true);
        setError(null);

        // 1. Ask backend for a presigned URL & create DB row
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, type: file.type }),
        });
        if (!res.ok) throw new Error('Failed to get upload URL');
        const { url, job } = await res.json();

        // 2. PUT the file directly to S3
        const put = await fetch(url, {
          method: 'PUT',
          body: file,
        });
        if (!put.ok) throw new Error('S3 upload failed');

        // 3. Notify parent on success
        await onUploadComplete?.(job);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov'],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ' +
          (isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300')
        }
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin" />
            <p className="text-sm">Uploading…</p>
          </div>
        ) : (
          <>
            <p className="text-center text-sm">
              {isDragActive
                ? 'Drop the file here to start uploading'
                : 'Drag and drop an audio/video file here or click to select one'}
            </p>
            <Button variant="secondary" className="pointer-events-none mt-4">
              Select File
            </Button>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
