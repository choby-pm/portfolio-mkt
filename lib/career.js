import { useSyncExternalStore } from "react";

// 순서 = 색 슬롯 순서 (dataviz 검증 팔레트 1~4번, 인접 쌍 색각이상 검증됨). 바꾸면 재검증 필요
export const FIELDS = [
  { id: "기획", color: "var(--field-1)" },
  { id: "SEO", color: "var(--field-2)" },
  { id: "개발", color: "var(--field-3)" },
  { id: "마케팅", color: "var(--field-4)" },
];
export const fieldColor = (id) => FIELDS.find((f) => f.id === id)?.color;

// "2024.05" → 월 인덱스
const toMonth = (s) => {
  const [y, m] = s.split(".").map(Number);
  return y * 12 + m - 1;
};

// 근무 개월 = 종료 월 − 시작 월 ("현재"는 이번 달). 시작 · 종료 월을 둘 다 꽉 찬 달로 세면
// 회사마다 한 달씩 늘고, 이직한 달(앞 회사 종료 = 다음 회사 시작)이 두 번 세어져 총 경력이 부풀려짐
export const spans = (career, now) =>
  career.map((c) => {
    const [a, b] = c.period.split(" - ");
    const start = toMonth(a);
    const end = b === "현재" || b === "Present" ? now : toMonth(b);
    return { ...c, start, end, months: Math.max(1, end - start) };
  });

export const formatMonths = (m) => [m >= 12 && `${Math.floor(m / 12)}년`, m % 12 && `${m % 12}개월`].filter(Boolean).join(" ");

// 현재 월은 클라이언트에서만 읽음: 프리렌더 중 new Date()는 빌드 에러이고, 빌드 시점 값으로 굳으면 안 됨
const noop = () => () => {};
export const useNowMonth = () =>
  useSyncExternalStore(noop, () => {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }, () => null);
