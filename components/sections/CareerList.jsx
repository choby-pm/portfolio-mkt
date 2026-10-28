"use client";

import { spans, fieldColor, formatMonths, useNowMonth } from "@/lib/career";
import { CareerDocLink } from "@/components/CareerDocModal";
import { DeckLink } from "@/components/DeckModal";
import careerDocs from "@/data/career-docs.json";

// 경력: 최신순 세로 목록. 기간 | 회사 · 직무 · 요약. 회사명을 누르면 경력기술서 모달(open_career_doc)
export function CareerList({ career }) {
  const now = useNowMonth();
  const items = now === null ? career : spans(career, now);
  return (
    <ol className="border-t border-border">
      {items.map((c) => (
        <li key={c.company} className="py-6 border-b border-border grid md:grid-cols-[11rem_minmax(0,1fr)] gap-x-8 gap-y-2">
          <p className="text-sm text-muted tabular-nums">
            {c.period}
            {c.months > 0 && <span className="block">{formatMonths(c.months)}</span>}
          </p>
          <div className="max-w-[42em]">
            <h3 className="text-lg font-bold">
              {careerDocs[c.company] ? <CareerDocLink doc={careerDocs[c.company]}>{c.company}</CareerDocLink> : c.company}
            </h3>
            <p className="mt-0.5 text-sm text-muted flex items-center gap-2">
              <span className="size-2 rounded-full shrink-0" style={{ background: fieldColor(c.field) }} aria-hidden />
              {c.field} 직무 · {c.role}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">{c.gained}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function List({ title, items, render }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 flex flex-col gap-3 text-[15px]">
        {items.map((x) => (
          <li key={x.name}>
            {render(x)}
            <span className="block text-sm text-muted tabular-nums">{x.period} · {x.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 학력 · 수상 · 해외 활동: 세 목록. 수상은 발표 자료 모달(open_award)
export function Background({ education, awards, activities }) {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      <List title="학력 · 교육" items={education} render={(e) => <span className="font-medium">{e.name}</span>} />
      <List title="수상" items={awards} render={(a) => (a.deck ? <DeckLink deck={a.deck}>{a.name}</DeckLink> : <span className="font-medium">{a.name}</span>)} />
      <List title="해외 활동" items={activities} render={(a) => <span className="font-medium">{a.name}</span>} />
    </div>
  );
}
