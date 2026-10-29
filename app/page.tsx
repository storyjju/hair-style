import { RecommendationFlow } from "@/components/hairstyle/recommendation-flow";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">
          헤어스타일 추천
        </h1>
        <p className="text-muted-foreground">
          미용실에 가기 전, 어떤 스타일로 할지 고민된다면 여기서 먼저
          둘러보세요.
        </p>
      </header>
      <RecommendationFlow />
    </main>
  );
}
