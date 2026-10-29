"use client";

import { MapPinIcon } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  NEARBY_RADIUS_KM,
  recommendSalons,
  type SalonWithDistance,
} from "@/lib/hairstyle/nearby";
import type { Location } from "@/lib/hairstyle/salons";

type Locating = "idle" | "loading" | "denied";

function SalonList({
  title,
  salons,
}: {
  title: string;
  salons: SalonWithDistance[];
}) {
  return (
    <section className="flex flex-col gap-2" aria-label={title}>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="flex flex-col gap-2">
        {salons.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.area}</span>
            </div>
            {s.distanceKm !== null && (
              <span className="shrink-0 text-sm text-muted-foreground">
                {s.distanceKm.toFixed(1)}km
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SalonResults({ styleId }: { styleId: string }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [locating, setLocating] = useState<Locating>("idle");

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocating("denied");
      return;
    }
    setLocating("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating("idle");
      },
      () => setLocating("denied"),
      { timeout: 10000 }
    );
  };

  const result = recommendSalons(styleId, location);

  return (
    <div className="flex flex-col gap-4">
      {!location && (
        <Alert>
          <MapPinIcon />
          <AlertDescription className="flex flex-col gap-2">
            <span>
              {locating === "denied"
                ? "위치를 확인할 수 없어 근처와 먼 곳을 나누지 못했습니다. 이 스타일을 해주는 미용실을 거리 구분 없이 보여드립니다."
                : "내 위치를 사용하면 근처 미용실을 먼저 보여드립니다."}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="self-start"
              onClick={requestLocation}
              disabled={locating === "loading"}
            >
              {locating === "loading" ? "위치 확인 중" : "내 위치 사용"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {result.mode === "unknown-location" && (
        <SalonList title="이 스타일을 해주는 미용실" salons={result.matched} />
      )}
      {result.mode === "nearby-match" && (
        <SalonList
          title={`근처(${NEARBY_RADIUS_KM}km 이내)에서 이 스타일을 해주는 미용실`}
          salons={result.matched}
        />
      )}
      {result.mode === "far-match" && (
        <>
          <Alert>
            <AlertDescription>
              근처({NEARBY_RADIUS_KM}km 이내)에는 이 스타일을 해주는 미용실이
              없습니다.
            </AlertDescription>
          </Alert>
          <SalonList
            title="이 스타일을 해주는 먼 곳의 미용실"
            salons={result.matched}
          />
          {result.nearbyOthers.length > 0 && (
            <SalonList
              title="근처 미용실 (다른 스타일)"
              salons={result.nearbyOthers}
            />
          )}
        </>
      )}
    </div>
  );
}
