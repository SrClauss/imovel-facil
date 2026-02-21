// Ensure tests don't throw due to missing DATABASE_URL
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/imovel_facil_test";
// Ensure MinIO env vars used by code have safe defaults during unit tests
process.env.MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";
process.env.MINIO_BUCKET = process.env.MINIO_BUCKET || "imovel-facil";
process.env.MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "minio";
process.env.MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "minio12345";
process.env.MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";
