import { describe, expect, it } from "vitest";

import { parseStyleIds, recommendFromPhoto } from "./analyze";
import { HAIR_STYLES } from "./catalog";

const photo = { base64: "AAAA", mediaType: "image/png" as const };
const all = HAIR_STYLES.map((s) => s.id);

function fakeClient(impl: () => Promise<unknown>) {
  return { messages: { create: impl } } as never;
}

describe("parseStyleIds", () => {
  it("목록에 있는 id만 중복 없이 순서대로 돌려준다", () => {
    const text = '```json\n{"styleIds": ["bob", "nope", "bob", "dandy", "wolf", "crop", "leaf"]}\n```';
    expect(parseStyleIds(text)).toEqual(["bob", "dandy", "wolf", "crop", "leaf"]);
  });

  it("유효한 후보가 4개보다 적거나 형식이 틀리면 null이다", () => {
    expect(parseStyleIds('{"styleIds": ["bob", "dandy"]}')).toBeNull();
    expect(parseStyleIds("추천 없음")).toBeNull();
    expect(parseStyleIds("{broken")).toBeNull();
  });
});

describe("recommendFromPhoto", () => {
  it("성공하면 AI가 고른 후보를 돌려준다", async () => {
    const client = fakeClient(async () => ({
      stop_reason: "end_turn",
      content: [{ type: "text", text: '{"styleIds":["bob","dandy","wolf","crop","leaf","pixie"]}' }],
    }));
    const result = await recommendFromPhoto(photo, client);
    expect(result).toEqual({
      source: "ai",
      styleIds: ["bob", "dandy", "wolf", "crop", "leaf", "pixie"],
    });
  });

  it("호출이 실패하면 전체 스타일로 대체한다", async () => {
    const client = fakeClient(async () => {
      throw new Error("network");
    });
    expect(await recommendFromPhoto(photo, client)).toEqual({
      source: "fallback",
      styleIds: all,
      reason: "failed",
    });
  });

  it("응답이 거절되면 전체 스타일로 대체한다", async () => {
    const client = fakeClient(async () => ({ stop_reason: "refusal", content: [] }));
    expect((await recommendFromPhoto(photo, client)).source).toBe("fallback");
  });

  it("API 키가 없으면 호출하지 않고 전체 스타일로 대체한다", async () => {
    const saved = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      expect(await recommendFromPhoto(photo)).toEqual({
        source: "fallback",
        styleIds: all,
        reason: "no-key",
      });
    } finally {
      if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
    }
  });
});
