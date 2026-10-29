export const ANGLES = ["front", "right", "back", "left"] as const;
export type Angle = (typeof ANGLES)[number];

export const ANGLE_LABELS: Record<Angle, string> = {
  front: "앞",
  right: "오른쪽",
  back: "뒤",
  left: "왼쪽",
};

export type FaceShape = "round" | "oval" | "square" | "long" | "heart";

export type HairStyle = {
  id: string;
  name: string;
  description: string;
  suits: FaceShape[];
  images: Record<Angle, string>;
};

function imagesFor(id: string): Record<Angle, string> {
  return {
    front: `/styles/${id}/front.svg`,
    right: `/styles/${id}/right.svg`,
    back: `/styles/${id}/back.svg`,
    left: `/styles/${id}/left.svg`,
  };
}

const entries: Omit<HairStyle, "images">[] = [
  { id: "dandy", name: "댄디컷", description: "옆과 뒤를 깔끔하게 정리하고 윗머리를 자연스럽게 내린 단정한 짧은 머리", suits: ["oval", "square", "long"] },
  { id: "two-block", name: "투블럭", description: "옆과 뒤를 짧게 치고 윗머리를 길게 남겨 윤곽이 또렷한 머리", suits: ["round", "oval", "heart"] },
  { id: "leaf", name: "리프컷", description: "앞머리를 잎사귀처럼 가볍게 내려 부드러운 인상을 주는 머리", suits: ["oval", "round", "square"] },
  { id: "garyl", name: "가일컷", description: "이마를 시원하게 드러내고 가르마를 살린 깔끔한 머리", suits: ["round", "oval", "heart"] },
  { id: "shadow-perm", name: "쉐도우펌", description: "윗머리에 굵은 웨이브를 넣어 볼륨과 자연스러운 결을 만든 머리", suits: ["long", "square", "oval"] },
  { id: "wolf", name: "울프컷", description: "윗머리는 짧고 뒷머리는 길게 층을 내 개성이 강한 머리", suits: ["oval", "heart", "round"] },
  { id: "layered", name: "레이어드컷", description: "층을 내서 가볍게 떨어지는 중간 길이 머리", suits: ["round", "long", "square"] },
  { id: "bob", name: "단발 보브", description: "턱선 근처에서 일직선으로 떨어지는 단정한 단발", suits: ["oval", "long", "heart"] },
  { id: "long-wave", name: "장발 웨이브", description: "어깨 아래까지 내려오는 긴 머리에 큰 웨이브를 넣은 머리", suits: ["oval", "heart", "square"] },
  { id: "pixie", name: "픽시컷", description: "전체를 짧게 쳐서 이목구비를 드러내는 아주 짧은 머리", suits: ["oval", "heart", "long"] },
  { id: "hippie-perm", name: "히피펌", description: "잔잔한 웨이브를 촘촘히 넣어 풍성한 느낌을 낸 머리", suits: ["long", "oval", "square"] },
  { id: "crop", name: "크롭컷", description: "앞머리를 짧게 자르고 전체 길이를 줄인 간결한 머리", suits: ["oval", "square", "round"] },
];

export const HAIR_STYLES: HairStyle[] = entries.map((e) => ({
  ...e,
  images: imagesFor(e.id),
}));

export function findStyle(id: string): HairStyle | undefined {
  return HAIR_STYLES.find((s) => s.id === id);
}
