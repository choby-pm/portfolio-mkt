"use client";

import { useEffect, useRef, useState } from "react";
import { X, SquareArrowOutUpRight } from "lucide-react";
import { track } from "@/lib/gtag";

// 회사별 경력기술서 모달. DeckModal과 같이 <dialog>의 showModal로 딤드 · 포커스 가두기 · Esc 닫기를 브라우저에 맡김
// doc: data/career-docs.json의 회사 항목 { company, dept, period, overview, keywords[], duties[] }
export default function CareerDocModal({ doc, open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={`${doc.company} 경력기술서`}
      // 회사명 버튼 안에 놓이므로 부모의 굵기 · 자간 · 글자 크기를 끊음
      className="m-auto w-[min(92vw,52rem)] max-h-[90vh] bg-transparent p-0 text-text text-base font-normal tracking-normal text-left backdrop:bg-black/70 opacity-0 scale-[0.98] open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-[0.98] transition-[opacity,scale,display,overlay] transition-discrete duration-200 ease-out motion-reduce:transition-none"
    >
      <div className="card flex flex-col max-h-[90vh]">
        <header className="flex items-start justify-between gap-4 p-5 md:p-6 border-b border-border bg-surface-2">
          <div className="min-w-0">
            <p className="text-xs text-muted">경력기술서</p>
            <h2 className="mt-1 font-heading text-xl md:text-2xl font-bold">{doc.company}</h2>
            <p className="mt-1 text-sm text-muted">
              {doc.dept} <span className="mx-1.5">·</span> <span className="tabular-nums">{doc.period}</span>
            </p>
          </div>
          <button onClick={onClose} aria-label="닫기" className="size-9 grid place-items-center shrink-0 rounded-sm text-muted hover:text-text hover:bg-surface">
            <X size={18} aria-hidden />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5 md:p-6 flex flex-col gap-7">
          <CareerDocBody doc={doc} />
        </div>
      </div>
    </dialog>
  );
}

// 경력기술서가 있다는 표시. 카드 전체가 버튼인 Career 메뉴에서는 장식으로만 씀
export const DocBadge = () => (
  <span className="size-5 inline-grid place-items-center rounded-sm bg-accent-soft text-accent shrink-0 align-middle" aria-label="경력기술서 보기">
    <SquareArrowOutUpRight size={11} aria-hidden />
  </span>
);

// 회사명 옆 아이콘을 누르면 경력기술서 모달이 열림. 맨 아이콘보다 눈에 띄게 강조색 배경을 깔음
export function CareerDocLink({ doc, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => { setOpen(true); track("open_career_doc", { company: doc.company }); }} className="inline-flex items-center gap-1.5 font-medium text-left hover:text-accent transition-colors">
        {children}
        <DocBadge />
      </button>
      <CareerDocModal doc={doc} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// 경력기술서 본문(개요 · 키워드 · 업무). 모달과 경력 이력 상세가 같이 씀. overview=false면 개요 문단 생략
export function CareerDocBody({ doc, overview = true }) {
  return (
    <>
      {overview && (
      <section>
        <p className="text-sm md:text-[15px] leading-relaxed">{doc.overview}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="핵심 키워드">
          {doc.keywords.map((k) => (
            <li key={k} className="px-2 h-6 inline-flex items-center rounded-xs bg-accent-soft text-accent text-xs">{k}</li>
          ))}
        </ul>
      </section>
      )}

      {doc.duties.map((d) => (
        <section key={d.title} className="border-l-2 border-accent/60 pl-4 md:pl-5">
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
            <h3 className="font-semibold">{d.title}</h3>
            <p className="text-xs text-muted tabular-nums shrink-0">{d.period}</p>
          </div>
          {d.scope && <p className="mt-2 inline-block px-2 py-0.5 rounded-sm border border-border text-xs text-muted">{d.scope}</p>}
          <p className="mt-2 text-sm leading-relaxed">{d.summary}</p>

          {/* 요약만 남긴 업무(마케팅과 먼 업무)는 세부 항목 없음 */}
          {d.items.length > 0 && (
            <dl className="mt-3 grid sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-2 text-sm">
              {d.items.map(([label, text]) => (
                <div key={label} className="contents">
                  <dt className="font-medium text-muted">{label}</dt>
                  <dd className="leading-relaxed mb-1 sm:mb-0">{text}</dd>
                </div>
              ))}
            </dl>
          )}

          {d.results && (
            <div className="mt-4 clay p-3.5">
              <p className="text-xs font-semibold text-accent">주요 성과</p>
              <ul className="mt-1.5 flex flex-col gap-1 text-sm leading-relaxed list-disc pl-4">
                {d.results.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
