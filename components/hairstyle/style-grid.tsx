import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import type { HairStyle } from "@/lib/hairstyle/catalog";

export function StyleGrid({
  styles,
  onSelect,
}: {
  styles: HairStyle[];
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {styles.map((style) => (
        <li key={style.id}>
          <button
            type="button"
            onClick={() => onSelect(style.id)}
            className="block w-full rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
              <Image
                src={style.images.front}
                alt={`${style.name} 앞모습`}
                width={400}
                height={480}
                className="aspect-[5/6] w-full object-cover"
              />
              <CardContent className="flex flex-col gap-1">
                <span className="font-medium">{style.name}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {style.description}
                </span>
              </CardContent>
            </Card>
          </button>
        </li>
      ))}
    </ul>
  );
}
