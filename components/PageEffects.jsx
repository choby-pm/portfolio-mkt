"use client";

import { useEffect } from "react";
import { pageview } from "@vercel/analytics";
import { track } from "@/lib/gtag";

// 화면 가운데 줄을 1초 이상 지난 섹션을 GA4 view_screen으로 기록 (스크롤로 스쳐 지나간 섹션은 제외)
// shortcut: Vercel Hobby는 커스텀 이벤트가 없어 가상 pageview로 기록, Pro 전환 시 track()으로 교체. 첫 화면은 "/" 자동 기록과 중복이라 제외
export default function PageEffects() {
  useEffect(() => {
    let timer;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          clearTimeout(timer);
          const id = e.target.id;
          timer = setTimeout(() => {
            track("view_screen", { screen: id });
            if (id !== "top") pageview({ path: `/${id}` });
          }, 1000);
        }),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    document.querySelectorAll("section[data-track]").forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);
  return null;
}
