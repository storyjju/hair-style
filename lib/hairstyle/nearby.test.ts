import { describe, expect, it } from "vitest";

import { recommendSalons } from "./nearby";

const gangnam = { lat: 37.4979, lng: 127.0276 };
const jeju = { lat: 33.4996, lng: 126.5312 };

describe("recommendSalons", () => {
  it("위치를 모르면 거리 없이 맞는 미용실만 보여준다", () => {
    const result = recommendSalons("dandy", null);
    expect(result.mode).toBe("unknown-location");
    expect(result.matched.length).toBeGreaterThan(0);
    expect(result.matched.every((s) => s.distanceKm === null)).toBe(true);
    expect(result.matched.every((s) => s.styleIds.includes("dandy"))).toBe(true);
  });

  it("근처에 맞는 곳이 있으면 근처 미용실만 가까운 순으로 보여준다", () => {
    const result = recommendSalons("dandy", gangnam);
    expect(result.mode).toBe("nearby-match");
    const distances = result.matched.map((s) => s.distanceKm!);
    expect(distances.every((d) => d <= 10)).toBe(true);
    expect([...distances].sort((a, b) => a - b)).toEqual(distances);
  });

  it("근처에 맞는 곳이 없으면 먼 곳을 추천하고 근처 미용실은 따로 준다", () => {
    const result = recommendSalons("long-wave", jeju);
    expect(result.mode).toBe("far-match");
    expect(result.matched.every((s) => s.distanceKm! > 10)).toBe(true);
    expect(result.matched.every((s) => s.styleIds.includes("long-wave"))).toBe(true);
    if (result.mode === "far-match") {
      expect(result.nearbyOthers.length).toBeGreaterThan(0);
      expect(result.nearbyOthers.every((s) => !s.styleIds.includes("long-wave"))).toBe(true);
    }
  });
});
