import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { NextRequest, NextResponse } from 'next/server';

const sqs = new SQSClient({ region: process.env.AWS_REGION });

export const POST = async (req: NextRequest) => {
  const { jobId, s3Key } = await req.json();

  if (!jobId || !s3Key) {
    return NextResponse.json({ error: 'Missing jobId or s3Key' }, { status: 400 });
  }

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.JOBS_QUEUE_URL,
      MessageBody: JSON.stringify({ job_id: jobId, s3_key: s3Key }),
    })
  );
  return NextResponse.json({ success: true });
};
