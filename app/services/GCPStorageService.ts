import { Storage, type File as GCSFile } from "@google-cloud/storage";
import path from "path";
import serviceAccount from "../../gcp-service-account.json";
import { randomUUID } from "crypto";

// Initialize the storage client
const storage = new Storage({
  credentials: serviceAccount,
});

/**
 * Google Cloud Storage helper focused on user‑centric object organisation.
 *
 * Each object is stored under the key pattern:
 *     <userId>/<fileName>
 *
 * This allows cheap `prefix` listings and simple IAM conditions per user.
 */

// GCS_BUCKET_NAME = "venue-visualiser";

const bucketName = process.env.GCS_BUCKET_NAME;
if (!bucketName) {
  throw new Error("Environment variable GCS_BUCKET_NAME is not set");
}

const bucket = storage.bucket(bucketName);

function buildGCPPath(userId: string, fileName: string): string {
  const randomId = randomUUID();
  const uniqueFileName = randomId + "_" + fileName;
  return "users/" + userId + "/" + uniqueFileName;
}

export interface SaveFileOptions {
  /** Optional MIME type, e.g. 'video/mp4' */
  contentType?: string;
}

/**
 * Uploads data to the bucket under its stream folder.
 * @returns true on success, false on failure.
 */
async function saveFile(
  userId: string,
  fileName: string,
  data: Buffer | string,
  opts: SaveFileOptions = {}
): Promise<{
  gcpPath: string;
  success: boolean;
}> {
  try {
    const gcpPath = buildGCPPath(userId, fileName);
    console.log(`GCS: Saving file to bucket: ${gcpPath}`);
    if (!gcpPath) {
      return { gcpPath: "", success: false };
    }
    const file = bucket.file(gcpPath);

    await file.save(data, {
      resumable: false,
      contentType: opts.contentType,
      metadata: {
        userId, // convenient for browser console / tools
      },
    });
    await file.makePublic();
    console.log(`GCS: File saved successfully`);
    return { gcpPath, success: true };
  } catch (err) {
    console.error("[GCS] saveFile", err);
    return { gcpPath: "", success: false };
  }
}

/**
 * Returns the file contents as a Buffer.
 * Throws if the object cannot be downloaded.
 */
async function downloadFile(gcsPath: string): Promise<Buffer> {
  const file = bucket.file(gcsPath);
  const [contents] = await file.download();
  return contents;
}

/**
 * Deletes an object. Returns true if delete succeeded or the object didn't exist.
 */
async function deleteFile(gcpPath: string): Promise<boolean> {
  try {
    await bucket.file(gcpPath).delete({ ignoreNotFound: true });
    return true;
  } catch (err) {
    console.error("[GCS] deleteFile", err);
    return false;
  }
}

/**
 * Generates a public URL for a file in GCS.
 */
export function getFullUrl(gcsPath: string): string {
  return `https://storage.googleapis.com/${bucketName}/${gcsPath}`;
}

export { bucket, saveFile, downloadFile, deleteFile };
