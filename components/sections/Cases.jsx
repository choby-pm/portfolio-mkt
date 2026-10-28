"use client";

import { ChevronDown, Check, CircleCheck } from "lucide-react";
import { track } from "@/lib/gtag";
import Visual from "./Visual";

// 지표: 값이 null이면 지어내지 않고 "—" + 수치 확인 중
function Metrics({ items }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
      {items.map((m) => (
        <div key={m.label}>
          <dt className="text-sm text-muted">{m.label}</dt>
          <dd className={`mt-0.5 text-xl font-bold tabular-nums ${m.value === null ? "text-muted" : ""}`}>
            {m.value ?? "—"}
            <span className="block text-xs font-normal text-muted">{m.value === null ? "수치 확인 중" : m.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Label({ children }) {
  return <h4 className="mb-3 font-semibold">{children}</h4>;
}

// 펼친 내용: 실행 흐름(순서가 있는 단계라 번호) → 주요 과제 → 그 밖의 결과
function Detail({ c }) {
  return (
    <div className="@container mt-6 flex flex-col gap-8">
      <div>
        <Label>실행 흐름</Label>
        <ol className="flex flex-col gap-2">
          {c.myRole.map((r, k) => (
            <li key={r} className="flex items-baseline gap-3 text-[15px]">
              <span className="size-6 shrink-0 grid place-items-center rounded-full bg-surface-2 text-xs font-semibold tabular-nums">{k + 1}</span>
              {r}
            </li>
          ))}
        </ol>
      </div>
      {c.troubles.map((t) => (
        <div key={t.title}>
          <p className="text-sm text-accent font-medium">{t.skill}</p>
          <h4 className="mt-1 text-lg font-bold">{t.title}</h4>
          <div className="mt-2 max-w-[42em] flex flex-col gap-2 text-[15px] leading-relaxed">
            <p className="text-muted">{t.problem}</p>
            <p>{t.action}</p>
          </div>
          {t.visual && <div className="mt-4"><Visual visual={t.visual} /></div>}
          <p className="mt-3 font-medium flex items-start gap-2">
            <Check size={18} className="text-accent shrink-0 mt-0.5" aria-hidden />{t.result}
          </p>
        </div>
      ))}
      {c.outcome.length > 1 && <div>
        <Label>그 밖의 결과</Label>
        <ul className="flex flex-col gap-2">
          {c.outcome.slice(1).map((o) => (
            <li key={o} className="flex gap-2.5 text-[15px] leading-relaxed">
              <CircleCheck size={18} className="text-ok shrink-0 mt-0.5" aria-hidden />{o}
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
}

// 케이스 한 건 = 큰 행 하나. 왼쪽: 회사 · 기간과 대표 결과 한 문장(결과 먼저) / 오른쪽: 제목 · 채널 · 맥락 · 지표 · 펼치기
// 펼치기는 <details>라 키보드 · 스크린리더가 기본 지원
export default function Cases({ campaigns }) {
  return (
    <div className="border-t border-border">
      {campaigns.map((c) => (
        <article key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-20 py-10 md:py-12 border-b border-border grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-12 gap-y-5">
          <div>
            <p className="text-sm text-muted tabular-nums">
              {c.company} · {c.period}
              {c.status.kind === "live" && <span className="ml-2 px-1.5 py-0.5 rounded-xs bg-ok-soft text-ok text-xs">{c.status.label}</span>}
            </p>
            <p className="mt-3 text-[22px] md:text-[26px] font-bold leading-[1.4] tracking-tight text-balance">{c.outcome[0]}</p>
          </div>
          <div className="min-w-0">
            <h3 id={`${c.id}-title`} className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-accent">{c.channel}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.summary}</p>
            <div className="mt-6"><Metrics items={c.metrics} /></div>
            <details className="group mt-6" onToggle={(e) => e.currentTarget.open && track("view_section", { item: c.id, section: "detail" })}>
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer inline-flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
                <span className="group-open:hidden">실행 흐름 · 주요 과제 보기</span>
                <span className="hidden group-open:inline">접기</span>
                <ChevronDown size={16} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </summary>
              <Detail c={c} />
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
