import type { CampaignPhotoRef } from "../store/useCampaignDraft";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fallbackRegion = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-2";

export function displayUrlForPhoto(p: CampaignPhotoRef): string {
  if (p.image_url) return p.image_url;
  if (!p.s3_bucket || !p.s3_key) return "";
  return `https://${p.s3_bucket}.s3.${fallbackRegion}.amazonaws.com/${p.s3_key}`;
}

/** True when stored `content_type` is a video (e.g. video/mp4). */
export function isVideoContentType(
  contentType: string | undefined | null,
): boolean {
  if (!contentType) return false;
  return contentType.trim().toLowerCase().startsWith("video/");
}

export function photosPayloadForApi(photos: CampaignPhotoRef[]): Array<{
  s3_bucket: string;
  s3_key: string;
  content_type: string;
  is_primary: boolean;
  sort_order: number;
}> {
  return photos.map((p, i) => ({
    s3_bucket: p.s3_bucket,
    s3_key: p.s3_key,
    content_type: p.content_type || "image/jpeg",
    is_primary: i === 0,
    sort_order: i,
  }));
}

export async function uploadCampaignFilesToS3(
  campaignId: number,
  files: File[],
  token: string,
): Promise<CampaignPhotoRef[]> {
  const out: CampaignPhotoRef[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const contentType =
      file.type ||
      (/\.(mp4)$/i.test(file.name)
        ? "video/mp4"
        : /\.(webm)$/i.test(file.name)
          ? "video/webm"
          : /\.(mov)$/i.test(file.name)
            ? "video/quicktime"
            : "image/jpeg");
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${API_URL}/api/uploads/campaign-file?campaign_id=${encodeURIComponent(String(campaignId))}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      },
    );
    if (!res.ok) {
      throw new Error((await res.text()) || "File upload failed");
    }
    const data = (await res.json()) as {
      public_url: string;
      bucket: string;
      key: string;
    };
    out.push({
      s3_bucket: data.bucket,
      s3_key: data.key,
      content_type: contentType,
      is_primary: false,
      sort_order: i,
      image_url: data.public_url,
    });
  }
  return out;
}
