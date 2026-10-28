import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/gtag";
import { Check, ExternalLink, Building2, Handshake, CalendarRange, Users, BriefcaseBusiness, UserRound, Lightbulb, CircleCheck, ArrowRight } from "lucide-react";
import { GitHubMark } from "@/components/TopActions";
import Visual from "./Visual";
import { FormTable } from "@/components/Panel";

// 운영 중은 성공 색, 나머지(데모 등)는 강조색 옅은 칩
const STATUS = { live: "bg-ok-soft text-ok" };
export function Status({ status }) {
  return (
    <span className={`shrink-0 px-2 h-6 inline-flex items-center rounded-xs text-xs whitespace-nowrap ${STATUS[status.kind] ?? "bg-accent-soft text-accent"}`}>
      {status.label}
    </span>
  );
}

// 선택한 프로젝트에 대한 동작(데모 · 저장소). ERP 상세 화면의 툴바 자리
export function ProjectLinks({ links, className = "" }) {
  if (!links?.length) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-sm text-xs font-medium transition-colors ${l.kind === "demo" ? "bg-accent text-white hover:opacity-90" : "border border-border text-muted hover:text-text"}`}
        >
          {l.kind === "github" ? <GitHubMark /> : <ExternalLink size={14} aria-hidden />}
          {l.label}
        </a>
      ))}
    </div>
  );
}

// 핵심 지표: 숫자를 크게, 설명은 작게
function Metrics({ items }) {
  return (
    <dl className="grid grid-cols-3 gap-2 @2xl:gap-3">
      {items.map((m) => (
        <div key={m.label} className="clay border-l-2 border-l-accent px-3 py-3 @2xl:px-4">
          <dd className="text-lg @2xl:text-2xl font-bold tabular-nums leading-tight">{m.value}</dd>
          <dt className="mt-1 text-xs text-muted">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

// 화면 뷰어: 큰 화면 + 썸네일 줄. 썸네일을 누르면 큰 화면이 바뀜
function ScreenViewer({ shots }) {
  const [i, setI] = useState(0);
  const shot = shots[i];
  return (
    <figure className="flex flex-col gap-2">
      <a href={shot.src} target="_blank" rel="noreferrer" className="relative block aspect-[16/9] rounded-sm overflow-hidden border border-border bg-surface-2">
        <Image src={shot.src} alt={shot.caption} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover object-top" />
      </a>
      <figcaption className="text-xs text-muted">{shot.caption}</figcaption>
      {shots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="화면 선택">
          {shots.map((g, k) => (
            <button
              key={g.src}
              onClick={() => setI(k)}
              aria-label={g.caption}
              aria-pressed={k === i}
              className={`relative shrink-0 w-28 @2xl:w-36 aspect-[16/9] rounded-xs overflow-hidden border-2 transition-colors ${k === i ? "border-accent" : "border-border opacity-70 hover:opacity-100"}`}
            >
              <Image src={g.src} alt="" fill sizes="144px" className="object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}

// 한눈에 보기: 문제 해결 항목을 역량 → 과제 → 결과 카드로 요약. 누르면 문제 해결 탭으로
function Highlights({ troubles, onOpen }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
      {troubles.map((t) => (
        <li key={t.title}>
          <button onClick={onOpen} className="group h-full w-full text-left card p-4 flex flex-col gap-2 hover:border-accent transition-colors">
            <span className="self-start px-2 h-6 inline-flex items-center rounded-xs bg-accent-soft text-accent text-xs font-medium">{t.skill}</span>
            <span className="font-semibold leading-snug">{t.title}</span>
            <span className="mt-auto pt-2 border-t border-border text-sm text-muted flex items-start gap-1.5">
              <CircleCheck size={15} className="text-ok shrink-0 mt-0.5" aria-hidden />{t.result}
            </span>
            <span className="text-xs text-accent inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">자세히 보기<ArrowRight size={12} aria-hidden /></span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// 담당 업무 흐름: 가로로 이어진 단계(좁으면 세로)
function RoleFlow({ steps }) {
  return (
    <ol className="flex flex-col @3xl:flex-row gap-2 @3xl:gap-0">
      {steps.map((r, k) => (
        <li key={r} className="flex @3xl:flex-1 @3xl:flex-col items-center @3xl:items-stretch gap-2 min-w-0">
          <div className="flex items-center @3xl:w-full">
            <span className="size-7 shrink-0 rounded-full bg-accent text-white text-xs font-semibold grid place-items-center tabular-nums">{k + 1}</span>
            {k < steps.length - 1 && <span className="hidden @3xl:block h-px flex-1 bg-border" aria-hidden />}
          </div>
          <span className="text-sm leading-snug @3xl:pr-3">{r}</span>
        </li>
      ))}
    </ol>
  );
}

function Label({ children }) {
  return <h4 className="mb-2 text-sm font-semibold">{children}</h4>;
}

function Trouble({ t }) {
  return (
    <section aria-label={t.title} className="border-t border-border pt-6 first:border-0 first:pt-0">
      <p className="text-xs text-accent font-medium mb-1">{t.skill}</p>
      <h4 className="text-lg font-bold mb-3">{t.title}</h4>
      <div className="max-w-3xl flex flex-col gap-2 text-sm leading-relaxed">
        <p className="text-muted">{t.problem}</p>
        <p>{t.action}</p>
      </div>
      <div className="mt-4">
        <Visual visual={t.visual} />
      </div>
      {/* 해결책이 실제로 구현된 화면(선택). 프로젝트마다 필요한 항목에만 */}
      {t.image && (
        <figure className="mt-4">
          <a href={t.image.src} target="_blank" rel="noreferrer" className="block rounded-sm overflow-hidden border border-border">
            <Image src={t.image.src} alt={t.image.caption} width={1920} height={1080} sizes="(min-width: 1024px) 70vw, 100vw" className="w-full h-auto" />
          </a>
          <figcaption className="mt-2 text-xs text-muted">{t.image.caption}</figcaption>
        </figure>
      )}
      <p className="mt-3 text-sm font-medium flex items-start gap-1.5">
        <Check size={16} className="text-accent shrink-0 mt-0.5" aria-hidden />{t.result}
      </p>
    </section>
  );
}

const SECTIONS = [
  { id: "overview", label: "개요" },
  { id: "service", label: "서비스 구성" },
  { id: "troubles", label: "문제 해결" },
  { id: "outcome", label: "성과" },
];

function SectionTitle({ children, count }) {
  return (
    <h4 className="mb-4 pb-2 border-b border-border text-lg font-bold flex items-baseline gap-2">
      {children}
      {count != null && <span className="text-sm font-normal text-muted tabular-nums">{count}</span>}
    </h4>
  );
}

// 프로젝트 상세: 헤더 → 기본 정보 → 지표 → 섹션을 한 화면에 이어서 표시(탭 뒤에 숨기지 않음)
// 위에 붙는 바로가기 줄은 지금 보는 섹션을 강조하고, 누르면 상세 영역 안에서만 스크롤(바깥 메뉴는 그대로)
export default function CaseStudy({ p }) {
  const [active, setActive] = useState(SECTIONS[0].id);
  const article = useRef(null);
  const nav = useRef(null);

  // 좁은 화면에서 바로가기 줄이 넘치면, 지금 섹션 항목이 보이도록 가로로만 옮김
  useEffect(() => {
    const btn = nav.current?.querySelector("[aria-current]");
    if (btn) nav.current.scrollTo({ left: btn.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  // 스크롤 위치 → 지금 섹션. 처음 도달한 섹션을 GA에 한 번씩 기록(어디까지 읽는지 확인용)
  // 프로젝트를 바꾸면 상위에서 key로 새로 만들어 상태가 초기화됨
  useEffect(() => {
    const seen = new Set();
    const root = article.current.closest("main > section");
    const reach = (id) => {
      setActive(id);
      if (seen.has(id)) return;
      seen.add(id);
      track("view_section", { item: p.id, section: id });
    };
    const els = [...article.current.querySelectorAll("[data-section]")];
    // 마지막 섹션은 짧아 감지 띠에 닿지 않을 수 있음: 끝까지 내렸으면 항상 마지막 섹션
    const atBottom = () => root.scrollTop + root.clientHeight >= root.scrollHeight - 2;
    const last = els.at(-1).dataset.section;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reach(atBottom() ? last : e.target.dataset.section)),
      { root, rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => atBottom() && reach(last);
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      root.removeEventListener("scroll", onScroll);
    };
  }, [p.id]);

  const go = (id) => {
    const el = document.getElementById(`case-${id}`);
    const box = el?.closest("main > section");
    if (!box) return;
    box.scrollTo({ top: el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 56, behavior: "smooth" });
  };
  const sec = (id) => ({ "data-section": id, id: `case-${id}` });

  return (
    <article ref={article} className="@container card p-5 md:p-6 flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl md:text-2xl font-bold">{p.title}</h3>
          <Status status={p.status} />
        </div>
        <p className="text-sm md:text-base text-muted leading-relaxed">{p.summary}</p>
        <ProjectLinks links={p.links} />
      </header>

      <FormTable
        rows={[
          ["소속", p.company, Building2],
          ["고객사", p.client, Handshake],
          ["기간", <span key="p" className="tabular-nums">{p.period}</span>, CalendarRange],
          ["팀", p.team, Users],
          ["역할", p.role, BriefcaseBusiness],
        ]}
      />

      <Metrics items={p.metrics} />

      <nav ref={nav} aria-label="상세 섹션" className="sticky top-0 z-[5] -mx-5 md:-mx-6 px-5 md:px-6 bg-surface border-b border-border flex gap-1 overflow-x-auto no-scrollbar">
        {SECTIONS.map((t) => (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            aria-current={active === t.id ? "location" : undefined}
            className={`px-3 h-11 -mb-px border-b-2 text-sm whitespace-nowrap ${active === t.id ? "border-accent text-text font-medium" : "border-transparent text-muted hover:text-text"}`}
          >
            {t.label}
            {t.id === "troubles" && <span className="ml-1 text-xs text-muted tabular-nums">{p.troubles.length}</span>}
          </button>
        ))}
      </nav>

      <section {...sec("overview")} aria-label="개요">
        <div className="flex flex-col gap-6">
          {p.gallery.length > 0 && <ScreenViewer key={p.id} shots={p.gallery} />}
          {p.service && <p className="max-w-3xl text-sm @2xl:text-[15px] leading-relaxed">{p.service.intro}</p>}
          <div>
            <Label>한눈에 보기</Label>
            <Highlights troubles={p.troubles} onOpen={() => go("troubles")} />
          </div>
        </div>
      </section>

      {(p.service || p.myRole) && (
        <section {...sec("service")} aria-label="서비스 구성">
          <SectionTitle>서비스 구성</SectionTitle>
          <div className="flex flex-col gap-6">
            {p.service && (
              <>
                <div>
                  <Label>사용자</Label>
                  <ul className="grid @2xl:grid-cols-2 @4xl:grid-cols-4 gap-2">
                    {p.service.users.map((u) => (
                      <li key={u.name} className="clay p-3 flex gap-2.5">
                        <span className="size-8 shrink-0 rounded-full bg-accent-soft text-accent grid place-items-center"><UserRound size={16} aria-hidden /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{u.name}</span>
                          <span className="block mt-0.5 text-xs text-muted leading-relaxed">{u.desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label>주요 기능</Label>
                  <ul className="grid grid-cols-2 @4xl:grid-cols-3 gap-2">
                    {p.service.features.map((ft) => (
                      <li key={ft.title} className="card p-3 @2xl:p-3.5 border-t-2 border-t-accent">
                        <p className="text-sm font-semibold">{ft.title}</p>
                        <p className="mt-1 text-xs text-muted leading-relaxed">{ft.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {p.myRole && (
              <div>
                <Label>담당 업무 흐름</Label>
                <RoleFlow steps={p.myRole} />
              </div>
            )}
          </div>
        </section>
      )}

      <section {...sec("troubles")} aria-label="문제 해결">
        <SectionTitle count={p.troubles.length}>문제 해결</SectionTitle>
        <div className="flex flex-col gap-6">
          {p.troubles.map((t) => <Trouble key={t.title} t={t} />)}
        </div>
      </section>

      <section {...sec("outcome")} aria-label="성과">
        <SectionTitle>성과</SectionTitle>
        <div className="flex flex-col gap-4">
          <ul className="grid @2xl:grid-cols-2 gap-2">
            {p.outcome.map((o) => (
              <li key={o} className="clay p-3.5 flex gap-2.5 text-sm leading-relaxed">
                <CircleCheck size={18} className="text-ok shrink-0 mt-0.5" aria-hidden />{o}
              </li>
            ))}
          </ul>
          <div className="rounded-sm border border-accent/30 bg-accent-soft p-4 @2xl:p-5 flex gap-3">
            <Lightbulb size={20} className="text-accent shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-accent">배운 점</p>
              <p className="mt-1 text-sm @2xl:text-[15px] leading-relaxed">{p.learning}</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
