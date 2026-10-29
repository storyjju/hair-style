import {
  MAX_PHOTO_BYTES,
  PHOTO_TYPES,
  recommendFromPhoto,
  type PhotoType,
} from "@/lib/hairstyle/analyze";

export async function POST(request: Request) {
  const form = await request.formData();

  if (form.get("consent") !== "true") {
    return Response.json({ error: "consent-required" }, { status: 403 });
  }

  const photo = form.get("photo");
  if (!(photo instanceof File) || !PHOTO_TYPES.includes(photo.type as PhotoType)) {
    return Response.json({ error: "invalid-photo" }, { status: 400 });
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return Response.json({ error: "photo-too-large" }, { status: 413 });
  }

  const base64 = Buffer.from(await photo.arrayBuffer()).toString("base64");
  const result = await recommendFromPhoto({
    base64,
    mediaType: photo.type as PhotoType,
  });
  return Response.json(result);
}
