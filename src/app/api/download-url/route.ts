import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const DERIVED_BUCKET = process.env.DERIVED_BUCKET!;
const RAW_BUCKET = process.env.RAW_BUCKET!;

export async function GET(req: NextRequest) {
  let bucket_name = req.nextUrl.searchParams.get('bucket');
  const key = req.nextUrl.searchParams.get('key');

  if (bucket_name === 'derived') {
    bucket_name = DERIVED_BUCKET;
  } else if (bucket_name === 'raw') {
    bucket_name = RAW_BUCKET;
  } else {
    return NextResponse.json({ error: `Invalid bucket name ${bucket_name}` }, { status: 400 });
  }

  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: `Missing params ${key} ${bucket_name}` }, { status: 400 });
  }

  try {
    const cmd = new GetObjectCommand({ Bucket: bucket_name, Key: key });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 300 }); // 5 minutes
    console.log(url);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Presign error', err);
    return NextResponse.json({ error: 'Could not presign URL' });
  }
}
