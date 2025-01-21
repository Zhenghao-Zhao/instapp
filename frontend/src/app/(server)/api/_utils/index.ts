import { ENV } from "../../../../env";

export async function uploadCloudImage(filename: string, file: File) {
  return fetch(ENV.R2_BUCKET_URL + "/" + filename, {
    method: "PUT",
    headers: {
      "X-Custom-Auth-Key": ENV.R2_CUSTOM_AUTH_KEY,
    },
    body: file,
  });
}

export async function deleteCloudImage(filename: string) {
  return fetch(ENV.R2_BUCKET_URL + "/" + filename, {
    method: "DELETE",
    headers: {
      "X-Custom-Auth-Key": ENV.R2_CUSTOM_AUTH_KEY,
    },
  });
}

export function getImageURLFromFilename(filename: string) {
  return filename && ENV.R2_BUCKET_URL_PUBLIC + "/" + filename;
}

export function getOwnerURL(ownerUsername: string) {
  return ENV.NEXT_PUBLIC_BASE_URL + "/" + ownerUsername;
}

export async function uploadCloudImageBuffer(filename: string, buffer: Buffer) {
  return fetch(ENV.R2_BUCKET_URL + "/" + filename, {
    method: "PUT",
    headers: {
      "X-Custom-Auth-Key": ENV.R2_CUSTOM_AUTH_KEY,
    },
    body: buffer,
  });
}
