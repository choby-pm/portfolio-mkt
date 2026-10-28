import { spans, fieldColor, formatMonths, useNowMonth } from "@/lib/career";
import { CareerDocBody } from "@/components/CareerDocModal";
import { ChartGantt, GraduationCap, Award, Plane } from "lucide-react";
import { Panel, DataTable, RecordBar } from "@/components/Panel";
import { DeckLink } from "@/components/DeckModal";
import careerDocs from "@/data/career-docs.json";

// 직무 외(학업 · 교육 · 워홀 · 군복무)는 직군 색과 겹치지 않게 중립 회색 하나로
const NEUTRAL = "var(--muted)";

// 간트는 시각 요약이고 같은 정보가 아래 그리드와 표에 텍스트로 있으므로 스크린리더에선 숨김
function CareerGantt({ data, now }) {
  if (now === null) return <div className="min-h-[180px]" aria-hidden />;

  const bars = (items, name, color) =>
    spans(items, now).map((s) => ({ ...s, color: color(s), title: `${name(s)} · ${s.period} (${formatMonths(s.months)})` }));
  const rows = [
    // 직무: 회사마다 한 줄, 직군 색
    ...data.career.map((c) => ({ label: c.company, sub: c.field, bars: bars([c], (s) => s.company, (s) => fieldColor(s.field)) })),
    // 직무 외: 종류마다 한 줄에 여러 막대
    { label: "학위", bars: bars(data.education.filter((e) => e.type === "degree"), (s) => s.name, () => NEUTRAL) },
    { label: "교육과정", bars: bars(data.education.filter((e) => e.type !== "degree"), (s) => s.name, () => NEUTRAL) },
    { label: "워킹홀리데이", bars: bars(data.activities, (s) => s.name, () => NEUTRAL) },
    { label: "병역", bars: bars(data.military, (s) => s.name, () => NEUTRAL) },
  ].filter((r) => r.bars.length);

  const min = Math.min(...rows.flatMap((r) => r.bars.map((b) => b.start)));
  const range = now + 1 - min;
  const pos = (m) => `${((m - min) / range) * 100}%`;
  const years = [];
  for (let y = Math.ceil(min / 12); y * 12 <= now; y++) years.push(y);

  return (
    <div className="p-4 md:p-5" aria-hidden>
      <div className="flex gap-3">
        <div className="w-24 md:w-32 shrink-0 flex flex-col gap-3 text-xs">
          {rows.map((r) => (
            <p key={r.label} className="h-4 leading-4 truncate">
              {r.label} {r.sub && <span className="text-muted">{r.sub}</span>}
            </p>
          ))}
          <p className="h-4" />
        </div>
        <div className="relative flex-1 flex flex-col gap-3">
          {/* 연도 경계선: 축 라벨 줄(h-4 + gap-3)은 제외 */}
          {years.map((y) => (
            <span key={y} className="absolute top-0 bottom-7 border-l border-border" style={{ left: pos(y * 12) }} />
          ))}
          {rows.map((r) => (
            <div key={r.label} className="relative h-4">
              {r.bars.map((b) => (
                <div
                  key={b.period}
                  className="absolute inset-y-0 rounded-xs"
                  style={{ left: pos(b.start), width: pos(min + b.months), background: b.color }}
                  title={b.title}
                />
              ))}
            </div>
          ))}
          <div className="relative h-4 text-xs text-muted tabular-nums">
            {years.map((y) => (
              // 모바일은 칸이 좁아 5년 단위만 표시
              <span key={y} className={`absolute -translate-x-1/2 ${y % 5 ? "hidden md:inline" : ""}`} style={{ left: pos(y * 12) }}>{y}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 직군 칩: 색 점 + 이름 (색만으로 구분하지 않게 이름을 항상 함께)
function Field({ id }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
      <span className="size-2 rounded-full" style={{ background: fieldColor(id) }} aria-hidden />
      {id}
    </span>
  );
}

// 목록 그리드: 회사 · 직무 | 직군 | 근속. 행을 누르면 상세 화면. 하단 줄은 총 경력
function CareerGrid({ items, onOpen }) {
  const total = items.reduce((n, c) => n + (c.months ?? 0), 0);
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-2 text-xs text-muted text-left">
            <th className="font-medium px-4 py-2.5">회사</th>
            <th className="font-medium px-4 py-2.5 hidden md:table-cell">요약</th>
            <th className="font-medium px-2 py-2.5">직군</th>
            <th className="font-medium px-4 py-2.5 text-right">근속</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.company} className="relative border-t border-border hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3 align-top md:w-56">
                <button onClick={() => onOpen(c.company)} className="text-left font-medium hover:text-accent after:absolute after:inset-0">
                  {c.company}
                </button>
                <p className="mt-0.5 text-xs text-muted">{c.role}</p>
                <p className="mt-0.5 text-xs text-muted tabular-nums">{c.period}</p>
              </td>
              <td className="px-4 py-3 align-top text-muted hidden md:table-cell"><p className="line-clamp-2">{c.gained}</p></td>
              <td className="px-2 py-3 align-top"><Field id={c.field} /></td>
              <td className="px-4 py-3 align-top text-right text-xs text-muted tabular-nums whitespace-nowrap">{c.months ? formatMonths(c.months) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="h-10 px-4 border-t border-border bg-surface-2 text-xs text-muted flex items-center gap-2 [&>span+span]:before:content-['·'] [&>span+span]:before:mr-2">
        <span>{items.length}개사</span>
        {total > 0 && <span>총 {formatMonths(total)}</span>}
      </p>
    </div>
  );
}

// 상세: 회사 머리 → 요약 → 경력기술서(키워드 · 업무)
function CareerDetail({ c }) {
  const doc = careerDocs[c.company];
  return (
    <article className="card p-5 md:p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl md:text-2xl font-bold">{doc?.company ?? c.company}</h3>
          <Field id={c.field} />
        </div>
        <p className="text-sm text-muted">
          {doc?.dept ?? c.role} <span className="mx-1.5">·</span>
          <span className="tabular-nums">{c.period}</span>
          {c.months > 0 && <span className="tabular-nums"> ({formatMonths(c.months)})</span>}
        </p>
      </header>
      <p className="text-sm md:text-[15px] leading-relaxed">{c.gained}</p>
      {doc && (
        <>
          <ul className="flex flex-wrap gap-1.5" aria-label="핵심 키워드">
            {doc.keywords.map((k) => <li key={k} className="px-2 h-6 inline-flex items-center rounded-xs bg-accent-soft text-accent text-xs">{k}</li>)}
          </ul>
          <CareerDocBody doc={doc} overview={false} />
        </>
      )}
    </article>
  );
}

// 좁은 화면은 기간을 두 줄로 줄여 나머지 칸 폭 확보
const period = { label: "기간", className: "w-20 sm:w-32 text-xs text-muted tabular-nums sm:whitespace-nowrap" };

// 학력 · 수상 · 해외 활동: 목록 화면 아래에 표로
function Background({ data }) {
  return (
    <div className="grid xl:grid-cols-2 gap-4 items-start">
      <Panel title="학력 · 교육" icon={GraduationCap}>
        <DataTable
          cols={[period, { label: "기관", className: "font-medium" }, { label: "과정", className: "text-muted" }]}
          rows={data.education.map((e) => ({ key: e.name, cells: [e.period, e.name, e.detail] }))}
        />
      </Panel>
      <Panel title="수상" icon={Award}>
        <DataTable
          cols={[{ label: "연도", className: "w-16 text-xs text-muted tabular-nums" }, { label: "수상" }, { label: "내용", className: "text-muted" }]}
          rows={data.awards.map((a) => ({
            key: a.name,
            cells: [a.period, a.deck ? <DeckLink key="d" deck={a.deck}>{a.name}</DeckLink> : <span key="d" className="font-medium">{a.name}</span>, a.detail],
          }))}
        />
      </Panel>
      <Panel title="해외 활동" icon={Plane}>
        <DataTable
          cols={[period, { label: "활동", className: "font-medium" }, { label: "체류", className: "text-muted whitespace-nowrap" }]}
          rows={data.activities.map((a) => ({ key: a.name, cells: [a.period, a.name, a.detail] }))}
        />
      </Panel>
    </div>
  );
}

// 목록 화면(타임라인 + 그리드 + 학력 · 수상 · 해외 활동) ↔ 상세 화면. 상세는 상단 줄에서 목록 · 이전/다음 회사로 이동
export default function Career({ data, openId, onOpen, onBack }) {
  const now = useNowMonth();
  const items = now === null ? data.career : spans(data.career, now);
  const i = items.findIndex((c) => c.company === openId);

  if (i < 0) {
    return (
      <div className="flex flex-col gap-4">
        <Panel title="경력 타임라인" icon={ChartGantt}>
          <CareerGantt data={data} now={now} />
        </Panel>
        <CareerGrid items={items} onOpen={onOpen} />
        <Background data={data} />
      </div>
    );
  }
  const prev = items[i - 1], next = items[i + 1];
  return (
    <div className="flex flex-col gap-4">
      <RecordBar
        index={i}
        total={items.length}
        onBack={onBack}
        onPrev={prev && (() => onOpen(prev.company))}
        onNext={next && (() => onOpen(next.company))}
        prevLabel={prev?.company}
        nextLabel={next?.company}
      />
      <CareerDetail c={items[i]} />
    </div>
  );
}
