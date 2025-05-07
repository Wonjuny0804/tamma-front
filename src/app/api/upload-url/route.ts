import { NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@/lib/supabase/server';

const client = new S3Client({ region: 'us-east-1' });
const BUCKET = 'tamma-dev-raw';

export async function POST(req: Request) {
  const { fileName, type } = await req.json();
  const fileType = type.startsWith('audio/') ? 'audio' : 'video';
  console.log(type);
  const supabase = await createClient();

  // 1. create DB row (status=pending)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: job } = await supabase
    .from('jobs')
    .insert({
      user_id: user!.id,
      file_name: fileName,
      file_type: fileType,
      s3_key: `${fileType}/${user!.id}/${fileName}`,
    })
    .select()
    .single();

  // 2. presign S3 put
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: job.s3_key, ContentType: type });
  const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });

  return NextResponse.json({ url, job });
}
