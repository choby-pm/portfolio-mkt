"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Megaphone, Sparkles, Route, Mail } from "lucide-react";
import { pageview } from "@vercel/analytics";
import { track } from "@/lib/gtag";
import { SideNav, BottomNav } from "./Nav";
import TopActions from "./TopActions";
import Overview from "./sections/Overview";
import Campaigns from "./sections/Campaigns";
import GeoLab from "./sections/GeoLab";
import Career from "./sections/Career";
import Contact from "./sections/Contact";

const SECTIONS = [
  { id: "overview", label: "개요", short: "개요", icon: LayoutDashboard },
  { id: "campaigns", label: "캠페인", short: "캠페인", icon: Megaphone },
  { id: "geo", label: "GEO 랩", short: "GEO", icon: Sparkles },
  { id: "career", label: "경력", short: "경력", icon: Route },
  { id: "contact", label: "문의", short: "문의", icon: Mail },
];

// 섹션 끝에 닿은 뒤 다음 메뉴로 넘어가려면 이만큼 휠을 멈췄다 다시 굴려야 함(ms)
const EDGE_PAUSE = 500;

export default function Dashboard({ data }) {
  const mainRef = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);

  // 스크롤 → 내비 동기화: 화면의 절반 이상 보이는 섹션을 활성으로
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { root: mainRef.current, threshold: 0.5 }
    );
    mainRef.current.querySelectorAll(":scope > section").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // 휠: CSS mandatory snap은 작은 휠 입력에서 제자리로 되돌아가므로, 한 제스처당 한 섹션씩 이동
  // (섹션 내부가 더 스크롤될 수 있으면 내부 스크롤 우선). 터치 스와이프는 CSS snap이 처리.
  useEffect(() => {
    const main = mainRef.current;
    let lastStep = 0, lastWheel = 0, lastInner = 0;
    const onWheel = (e) => {
      // 모달이 열려 있으면 뒤 화면은 움직이지 않음. 모달 안의 휠은 통과(경력기술서 스크롤, DeckModal은 자체 처리)
      if (document.querySelector("dialog[open]")) {
        if (!e.target.closest("dialog[open]")) e.preventDefault();
        return;
      }
      const sec = e.target.closest("main > section");
      const dir = Math.sign(e.deltaY);
      if (!sec || !dir) return;
      const innerCanScroll = dir > 0 ? sec.scrollTop + sec.clientHeight < sec.scrollHeight - 1 : sec.scrollTop > 0;
      if (innerCanScroll) {
        lastInner = performance.now();
        return;
      }
      e.preventDefault();
      // 상세 화면(캠페인 · 경력)은 끝까지 스크롤해도 다음 섹션으로 넘어가지 않음. 목록 버튼이나 메뉴로 나감
      if (sec.dataset.lock !== undefined) return;
      const now = performance.now();
      // 섹션을 끝까지 스크롤한 그 제스처(관성 포함)로는 넘어가지 않음. 잠깐 멈췄다 다시 굴리면 다음 메뉴로
      if (now - lastInner < EDGE_PAUSE) {
        lastInner = now;
        return;
      }
      const fresh = now - lastWheel > 150;
      lastWheel = now;
      // 트랙패드 관성 스크롤로 여러 섹션이 한꺼번에 넘어가는 것 방지
      if (now - lastStep < 700 || (!fresh && now - lastStep < 1200)) return;
      const next = SECTIONS[SECTIONS.findIndex((s) => s.id === sec.id) + dir];
      if (!next) return;
      lastStep = now;
      setActive(next.id);
      document.getElementById(next.id).scrollIntoView({ behavior: "smooth" });
    };
    main.addEventListener("wheel", onWheel, { passive: false });
    return () => main.removeEventListener("wheel", onWheel);
  }, []);

  // 섹션별로 열린 상세: { campaigns: 캠페인 id, career: 회사명 }. 열려 있으면 그 섹션은 목록 대신 상세 화면
  const [open, setOpen] = useState({});
  const openDetail = (sec, id) => {
    setOpen((o) => ({ ...o, [sec]: id }));
    document.getElementById(sec).scrollTop = 0;
  };
  const closeDetail = (sec) => openDetail(sec, null);
  const caseId = open.campaigns;

  // 내비 클릭 → 해당 섹션으로 스냅 이동, 열린 상세는 닫음
  const goTo = (id) => {
    setActive(id);
    setOpen({});
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // shortcut: Hobby 플랜은 커스텀 이벤트 미지원이라 섹션 조회를 가상 pageview로 기록, Pro 전환 시 track()으로 교체
  // 1초 머문 섹션만 기록 (스크롤로 지나치는 섹션 제외), 첫 화면은 "/" 자동 기록과 중복이라 제외
  // GA4는 커스텀 이벤트가 되므로 열린 상세(프로젝트 id · 회사명)까지 view_screen 한 이벤트로 기록
  const firstView = useRef(true);
  const item = open[active];
  useEffect(() => {
    const t = setTimeout(() => {
      track("view_screen", { screen: active, item });
      if (firstView.current && active === SECTIONS[0].id) return;
      firstView.current = false;
      pageview({ path: active === "campaigns" && caseId ? `/case/${caseId}` : `/${active}` });
    }, 1000);
    return () => clearTimeout(t);
  }, [active, caseId, item]);

  const render = (id) => {
    switch (id) {
      case "overview":
        // 첫 화면 증거 줄 → Projects로 이동하며 해당 케이스 열기
        return <Overview data={data} onOpenCase={(id) => { goTo("campaigns"); openDetail("campaigns", id); }} onGo={goTo} />;
      case "campaigns":
        return <Campaigns campaigns={data.campaigns} openId={open.campaigns} onOpen={(id) => openDetail("campaigns", id)} onBack={() => closeDetail("campaigns")} />;
      case "geo":
        return <GeoLab geo={data.geo} />;
      case "career":
        return <Career data={data} openId={open.career} onOpen={(id) => openDetail("career", id)} onBack={() => closeDetail("career")} />;
      case "contact":
        return <Contact profile={data.profile} />;
    }
  };

  return (
    <div className="h-dvh flex flex-col md:flex-row">
      <SideNav sections={SECTIONS} active={active} onSelect={goTo} name={data.profile.name} role={data.profile.role} />
      {/* 상세가 열리면 바깥 스크롤을 잠가 휠·트랙패드 관성·키보드·스냅 재정렬 어떤 경로로도 섹션이 바뀌지 않게 (내비 클릭의 scrollIntoView는 동작) */}
      <main ref={mainRef} className={`flex-1 min-h-0 no-scrollbar snap-y snap-mandatory ${open.campaigns || open.career ? "overflow-hidden" : "overflow-y-auto"}`}>
        {SECTIONS.map(({ id, label }) => (
          <section
            key={id}
            id={id}
            aria-label={label}
            data-lock={open[id] ? "" : undefined}
            className="relative h-full snap-start overflow-y-auto no-scrollbar md:overscroll-y-contain data-lock:overscroll-y-contain"
          >
            {/* md 이상은 섹션 끝에서 남은 휠이 바깥(main)으로 번져 메뉴가 바뀌지 않게 overscroll 차단(섹션 이동은 휠 핸들러가 담당). 모바일 터치는 snap이 처리 */}
            {/* min-h-full + flex-col: Contact 폼처럼 남은 높이를 채우는 섹션용 */}
            <div className="min-h-full flex flex-col px-4 py-8 md:px-6 lg:px-8 md:pt-9 md:pb-8 short:pt-5 short:pb-4 xshort:pt-4 xshort:pb-2">
              <div className="mb-5 short:mb-4 xshort:mb-2 flex items-center gap-3">
                <h2 className="font-heading text-xl md:text-2xl font-bold leading-none">{label}</h2>
                {/* 분석 콘솔의 속성 · 기간 선택 칩 모양. 표시용이라 누를 수 없음 */}
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted">
                  <span className="clay h-6 px-2 inline-flex items-center">속성: {data.profile.name} · Growth</span>
                  <span className="clay h-6 px-2 inline-flex items-center tabular-nums">{data.profile.since} – 현재</span>
                </span>
                <TopActions profile={data.profile} />
              </div>
              {render(id)}
            </div>
          </section>
        ))}
      </main>
      <BottomNav sections={SECTIONS} active={active} onSelect={goTo} />
    </div>
  );
}
