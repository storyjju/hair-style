// @vitest-environment node
import { describe, expect, it } from "vitest";

import { POST } from "./route";

function request(fields: Record<string, string | Blob>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/api/recommend", { method: "POST", body: form });
}

describe("POST /api/recommend", () => {
  it("동의 없이는 사진을 처리하지 않는다", async () => {
    const photo = new File(["x"], "me.png", { type: "image/png" });
    const res = await POST(request({ photo }));
    expect(res.status).toBe(403);
  });

  it("이미지가 아니면 거절한다", async () => {
    const photo = new File(["x"], "me.txt", { type: "text/plain" });
    const res = await POST(request({ consent: "true", photo }));
    expect(res.status).toBe(400);
  });
});
