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

// 펼친 내용: 지표 → 실행 흐름(순서가 있는 단계라 번호) → 주요 과제 → 결과
function Detail({ c }) {
  return (
    <div className="@container mt-5 pl-4 md:pl-5 border-l-2 border-border flex flex-col gap-8">
      <Metrics items={c.metrics} />
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
      <div>
        <Label>결과</Label>
        <ul className="flex flex-col gap-2">
          {c.outcome.map((o) => (
            <li key={o} className="flex gap-2.5 text-[15px] leading-relaxed">
              <CircleCheck size={18} className="text-ok shrink-0 mt-0.5" aria-hidden />{o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 캠페인을 검색 결과 한 건처럼: 경로 줄(회사 › 채널 › 기간) · 파란 제목 · 두 줄 요약. 누르면 그 자리에서 펼침
// <details>라 키보드 · 스크린리더가 기본 지원. 출처 링크(#id)로 들어오면 PageEffects가 펼침
export default function Results({ campaigns }) {
  return (
    <ol className="flex flex-col gap-10">
      {campaigns.map((c) => (
        <li key={c.id}>
          <details
            id={c.id}
            className="group scroll-mt-28 md:scroll-mt-20"
            onToggle={(e) => e.currentTarget.open && track("view_section", { item: c.id, section: "detail" })}
          >
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer">
              <p className="text-sm text-ok truncate">
                {c.company} › {c.channel} › <span className="tabular-nums">{c.period}</span>
                {c.status.kind === "live" && <span className="ml-2 text-muted">{c.status.label}</span>}
              </p>
              <h3 className="mt-1 text-xl md:text-[22px] font-semibold text-accent group-hover:underline underline-offset-4">{c.title}</h3>
              <p className="mt-1.5 max-w-[42em] text-[15px] leading-relaxed text-muted line-clamp-2 group-open:line-clamp-none">{c.summary}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium">
                <span className="group-open:hidden">실행 흐름 · 주요 과제 · 결과 보기</span>
                <span className="hidden group-open:inline">접기</span>
                <ChevronDown size={16} className="transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
              </span>
            </summary>
            <Detail c={c} />
          </details>
        </li>
      ))}
    </ol>
  );
}
