export type Location = { lat: number; lng: number };

export type Salon = {
  id: string;
  name: string;
  area: string;
  location: Location;
  styleIds: string[];
};

// 첫 구현용 가상 데이터입니다. 실제 미용실 검색을 붙이면 대체합니다.
export const SALONS: Salon[] = [
  { id: "s1", name: "모노 헤어 강남", area: "서울 강남", location: { lat: 37.4979, lng: 127.0276 }, styleIds: ["dandy", "two-block", "garyl", "crop"] },
  { id: "s2", name: "루프 살롱 역삼", area: "서울 역삼", location: { lat: 37.5006, lng: 127.0364 }, styleIds: ["shadow-perm", "layered", "wolf", "leaf"] },
  { id: "s3", name: "메이 헤어 홍대", area: "서울 홍대", location: { lat: 37.5563, lng: 126.9236 }, styleIds: ["wolf", "bob", "pixie", "hippie-perm"] },
  { id: "s4", name: "오브 스튜디오 성수", area: "서울 성수", location: { lat: 37.5446, lng: 127.0557 }, styleIds: ["leaf", "dandy", "crop", "two-block"] },
  { id: "s5", name: "벨라 헤어 잠실", area: "서울 잠실", location: { lat: 37.5133, lng: 127.1002 }, styleIds: ["long-wave", "layered", "bob", "hippie-perm"] },
  { id: "s6", name: "더 컷 판교", area: "경기 성남 판교", location: { lat: 37.3947, lng: 127.1112 }, styleIds: ["dandy", "garyl", "shadow-perm", "pixie"] },
  { id: "s7", name: "하루 헤어 수원", area: "경기 수원", location: { lat: 37.2636, lng: 127.0286 }, styleIds: ["two-block", "leaf", "long-wave", "crop"] },
  { id: "s8", name: "블랑 살롱 대전", area: "대전 둔산", location: { lat: 36.3504, lng: 127.3845 }, styleIds: ["wolf", "shadow-perm", "bob", "layered"] },
  { id: "s9", name: "파도 헤어 해운대", area: "부산 해운대", location: { lat: 35.1631, lng: 129.1639 }, styleIds: ["hippie-perm", "long-wave", "pixie", "garyl"] },
  { id: "s10", name: "소소 헤어 제주", area: "제주 제주시", location: { lat: 33.4996, lng: 126.5312 }, styleIds: ["crop", "dandy", "leaf"] },
];
