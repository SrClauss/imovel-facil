import { S3Client, PutObjectCommand, DeleteObjectsCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
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
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    return;
  } catch (err: any) {
    // try to create
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
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
