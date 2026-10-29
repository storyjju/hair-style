import { SALONS, type Location, type Salon } from "./salons";

// "근처"로 보는 반경(km)입니다. 화면에도 같은 값을 보여줍니다.
export const NEARBY_RADIUS_KM = 10;

export type SalonWithDistance = Salon & { distanceKm: number | null };

export type SalonRecommendation =
  | { mode: "unknown-location"; matched: SalonWithDistance[] }
  | { mode: "nearby-match"; matched: SalonWithDistance[]; nearbyOthers: [] }
  | {
      mode: "far-match";
      matched: SalonWithDistance[];
      nearbyOthers: SalonWithDistance[];
    };

export function distanceKm(a: Location, b: Location): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function recommendSalons(
  styleId: string,
  location: Location | null,
  salons: Salon[] = SALONS
): SalonRecommendation {
  const matching = salons.filter((s) => s.styleIds.includes(styleId));

  if (!location) {
    return {
      mode: "unknown-location",
      matched: matching.map((s) => ({ ...s, distanceKm: null })),
    };
  }

  const withDistance = (list: Salon[]): SalonWithDistance[] =>
    list
      .map((s) => ({ ...s, distanceKm: distanceKm(location, s.location) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

  const matched = withDistance(matching);
  const matchedNearby = matched.filter((s) => s.distanceKm! <= NEARBY_RADIUS_KM);

  if (matchedNearby.length > 0) {
    return { mode: "nearby-match", matched: matchedNearby, nearbyOthers: [] };
  }

  const nearbyOthers = withDistance(
    salons.filter((s) => !s.styleIds.includes(styleId))
  ).filter((s) => s.distanceKm! <= NEARBY_RADIUS_KM);

  return { mode: "far-match", matched, nearbyOthers };
}
