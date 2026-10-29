import Anthropic from "@anthropic-ai/sdk";

import { HAIR_STYLES, type HairStyle } from "./catalog";

export const MIN_RECOMMENDATIONS = 4;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export type Recommendation = {
  source: "ai" | "fallback";
  styleIds: string[];
  reason?: "no-key" | "failed" | "too-few";
};

export function parseStyleIds(
  text: string,
  catalog: HairStyle[] = HAIR_STYLES
): string[] | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return null;
  }
  const raw = (parsed as { styleIds?: unknown })?.styleIds;
  if (!Array.isArray(raw)) return null;
  const known = new Set(catalog.map((s) => s.id));
  const ids = [...new Set(raw.filter((id): id is string => typeof id === "string" && known.has(id)))];
  return ids.length >= MIN_RECOMMENDATIONS ? ids : null;
}

function fallback(reason: Recommendation["reason"]): Recommendation {
  return { source: "fallback", styleIds: HAIR_STYLES.map((s) => s.id), reason };
}

const SYSTEM = `당신은 헤어스타일 상담가입니다. 사용자의 사진을 보고 얼굴형과 이미지에 어울릴 만한 스타일을 후보 목록에서만 고릅니다.
어울림은 사람마다 주관적이므로 서로 분위기가 다른 후보를 6개 고르고, 가장 어울리는 순서로 나열하세요.
설명 없이 아래 JSON만 출력하세요: {"styleIds": ["id1", "id2", ...]}`;

function catalogPrompt(catalog: HairStyle[]) {
  return catalog
    .map((s) => `- ${s.id}: ${s.name} (${s.description}) / 잘 맞는 얼굴형: ${s.suits.join(", ")}`)
    .join("\n");
}

export async function recommendFromPhoto(
  photo: { base64: string; mediaType: PhotoType },
  client?: Pick<Anthropic, "messages">
): Promise<Recommendation> {
  if (!client && !process.env.ANTHROPIC_API_KEY) return fallback("no-key");

  try {
    const api = client ?? new Anthropic();
    const response = await api.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: photo.mediaType, data: photo.base64 },
            },
            { type: "text", text: `후보 목록:\n${catalogPrompt(HAIR_STYLES)}` },
          ],
        },
      ],
    });
    if (response.stop_reason === "refusal") return fallback("failed");
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const ids = parseStyleIds(text);
    return ids ? { source: "ai", styleIds: ids } : fallback("too-few");
  } catch {
    return fallback("failed");
  }
}
