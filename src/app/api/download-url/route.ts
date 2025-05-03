import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.DERIVED_BUCKET!;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 300 }); // 5 minutes
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Presign error', err);
    return NextResponse.json({ error: 'Could not presign URL' });
  }
}
