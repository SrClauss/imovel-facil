import { S3Client, PutObjectCommand, DeleteObjectsCommand, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

const BUCKET = process.env.MINIO_BUCKET || "imovel-facil";
const PUBLIC_URL = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  region: process.env.MINIO_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minio",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minio12345",
  },
  forcePathStyle: true, // required for MinIO
});

function extFromMime(mime?: string) {
  if (!mime) return "";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  return "";
}

export async function ensureBucketExists(bucket = BUCKET) {
  let bucketExists = true;
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err: any) {
    bucketExists = false;
    // create bucket
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
  }
  
  // Set public read policy (allow anonymous read access to all objects)
  if (!bucketExists) {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucket}/*`]
        }
      ]
    };
    
    try {
      await s3.send(new PutBucketPolicyCommand({ 
        Bucket: bucket, 
        Policy: JSON.stringify(policy) 
      }));
      console.log(`Bucket ${bucket} policy set to public read`);
    } catch (err: any) {
      console.error("Failed to set bucket policy:", err.message);
    }
  }
}

export async function uploadImage(buffer: Buffer, contentType?: string, bucket = BUCKET): Promise<string> {
  const key = `${Date.now()}-${randomBytes(6).toString("hex")}${extFromMime(contentType)}`;
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }));
  return `${PUBLIC_URL}/${bucket}/${key}`;
}

export async function deleteObjects(keys: string[], bucket = BUCKET) {
  if (!keys || !keys.length) return;
  const Objects = keys.map((Key) => ({ Key }));
  await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects } }));
}

export function isMinioUrl(url?: string) {
  if (!url) return false;
  return url.startsWith(`${PUBLIC_URL}/${BUCKET}/`);
}

export function extractKeyFromUrl(url: string) {
  if (!isMinioUrl(url)) return url; // if not minio url, just return original
  return url.replace(`${PUBLIC_URL}/${BUCKET}/`, "");
}
