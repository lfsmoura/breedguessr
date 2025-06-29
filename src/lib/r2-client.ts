import { S3Client } from '@aws-sdk/client-s3';

export function createR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function getR2ImageUrl(key: string, bucketName: string = 'breeds') {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;
}