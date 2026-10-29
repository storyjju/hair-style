"use client";

import { ArrowLeftIcon, ImageUpIcon } from "lucide-react";
import { useState } from "react";

import { SalonResults } from "@/components/hairstyle/salon-results";
import { StyleGrid } from "@/components/hairstyle/style-grid";
import { StyleViewer360 } from "@/components/hairstyle/style-viewer-360";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { HAIR_STYLES, findStyle } from "@/lib/hairstyle/catalog";

type Phase = "start" | "analyzing" | "results" | "detail";

const ANALYSIS_FAILED = "사진 분석을 하지 못해 전체 스타일을 보여드립니다.";

export function RecommendationFlow() {
  const [phase, setPhase] = useState<Phase>("start");
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [styleIds, setStyleIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showAll = (message: string | null) => {
    setStyleIds(HAIR_STYLES.map((s) => s.id));
    setNotice(message);
    setPhase("results");
  };

  const analyze = async () => {
    if (!file || !consent) return;
    setPhase("analyzing");
    try {
      const body = new FormData();
      body.set("consent", "true");
      body.set("photo", file);
      const res = await fetch("/api/recommend", { method: "POST", body });
      if (!res.ok) throw new Error("request failed");
      const data: { source: "ai" | "fallback"; styleIds: string[] } =
        await res.json();
      if (data.source === "ai") {
        setStyleIds(data.styleIds);
        setNotice(null);
        setPhase("results");
      } else {
        showAll(ANALYSIS_FAILED);
      }
    } catch {
      showAll(ANALYSIS_FAILED);
    } finally {
      setFile(null);
    }
  };

  const selected = selectedId ? findStyle(selectedId) : undefined;

  if (phase === "detail" && selected) {
    return (
      <div className="flex flex-col gap-6">
        <Button
          variant="ghost"
          className="self-start"
          onClick={() => setPhase("results")}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          다른 스타일 보기
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">
              {selected.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selected.description}
            </p>
            <StyleViewer360 key={selected.id} style={selected} />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">미용실 추천</h2>
            <SalonResults key={selected.id} styleId={selected.id} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="flex flex-col gap-4" role="status" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          사진을 분석하고 있습니다.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-[5/6] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const styles = styleIds.flatMap((id) => findStyle(id) ?? []);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-semibold">
            어울릴 만한 스타일
          </h2>
          <Button variant="outline" size="sm" onClick={() => setPhase("start")}>
            처음으로
          </Button>
        </div>
        {notice && (
          <Alert>
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          마음에 드는 스타일을 눌러 360도로 확인해 보세요.
        </p>
        <StyleGrid
          styles={styles}
          onSelect={(id) => {
            setSelectedId(id);
            setPhase("detail");
          }}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 사진으로 어울리는 스타일 찾기</CardTitle>
        <CardDescription>
          사진을 올리면 어울릴 만한 스타일을 여러 개 보여드립니다. 고르는 것은
          직접 하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <AlertTitle>사진 전송 안내</AlertTitle>
          <AlertDescription>
            분석을 위해 사진이 외부 AI 서비스로 전송됩니다. 분석이 끝나면 사진은
            저장하지 않고 바로 지웁니다.
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-2">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
          />
          <Label htmlFor="consent">
            사진을 외부 AI 서비스로 전송하는 것에 동의합니다.
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="photo">내 사진</Label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={!consent}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-background file:px-3 file:py-1.5 file:text-sm disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={analyze} disabled={!consent || !file}>
            <ImageUpIcon data-icon="inline-start" />
            사진으로 추천받기
          </Button>
          <Button variant="outline" onClick={() => showAll(null)}>
            사진 없이 전체 스타일 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
