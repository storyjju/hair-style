"use client";

import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ANGLES, ANGLE_LABELS, type HairStyle } from "@/lib/hairstyle/catalog";

const DRAG_STEP_PX = 40;

export function StyleViewer360({ style }: { style: HairStyle }) {
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; index: number } | null>(null);

  const turn = (delta: number) =>
    setIndex((i) => (i + delta + ANGLES.length) % ANGLES.length);
  const angle = ANGLES[index];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="group"
        tabIndex={0}
        aria-label={`${style.name} 360도 보기. 좌우로 쓸거나 방향키로 돌립니다.`}
        data-testid="viewer-360"
        data-angle={angle}
        className="w-full max-w-sm cursor-grab touch-pan-y select-none overflow-hidden rounded-xl border bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            turn(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            turn(1);
          }
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, index };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const steps = Math.trunc((e.clientX - drag.current.x) / DRAG_STEP_PX);
          const next =
            (((drag.current.index - steps) % ANGLES.length) + ANGLES.length) %
            ANGLES.length;
          setIndex(next);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <Image
          src={style.images[angle]}
          alt={`${style.name} ${ANGLE_LABELS[angle]}모습`}
          width={400}
          height={480}
          draggable={false}
          priority
          className="aspect-[5/6] w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          aria-label="왼쪽으로 돌리기"
          onClick={() => turn(-1)}
        >
          <ChevronLeftIcon />
        </Button>
        <span
          className="min-w-16 text-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          {ANGLE_LABELS[angle]}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label="오른쪽으로 돌리기"
          onClick={() => turn(1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
