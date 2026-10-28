import { Fragment } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

const box = "clay";

// 단계 흐름: 넓으면 가로 화살표, 좁으면 세로로 쌓임. 마지막 단계를 강조
function Flow({ steps, note }) {
  return (
    <>
      <ol className="flex flex-col @2xl:flex-row @2xl:items-stretch gap-2">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col @2xl:flex-row @2xl:items-center gap-2 @2xl:flex-1 min-w-0">
            <div className={`${box} flex-1 h-full p-3.5 ${i === steps.length - 1 ? "border-accent bg-accent-soft" : ""}`}>
              <p className="text-sm font-semibold">{s.title}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <span className="self-center text-muted" aria-hidden>
                <ArrowRight size={14} className="hidden @2xl:block" />
                <ArrowDown size={14} className="@2xl:hidden" />
              </span>
            )}
          </li>
        ))}
      </ol>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </>
  );
}

// 깔때기: 아래로 갈수록 폭이 줄어듦 (처리 대상 감소)
function Funnel({ steps, note, side }) {
  return (
    <div className="grid @2xl:grid-cols-[1fr_16rem] gap-5">
      <div>
        <ol className="flex flex-col items-center gap-1">
          {steps.map((s, i) => (
            <li key={s.title} className="w-full flex flex-col items-center gap-1">
              <div
                className={`${box} p-3 text-center ${i === steps.length - 1 ? "border-accent bg-accent-soft" : ""}`}
                style={{ width: `${100 - i * 10}%` }}
              >
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-0.5 text-xs text-muted">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowDown size={12} className="text-muted" aria-hidden />}
            </li>
          ))}
        </ol>
        {note && <p className="mt-3 text-xs text-muted text-center">{note}</p>}
      </div>
      {side && (
        <div className="self-start rounded-sm border border-dashed border-border p-4">
          <p className="text-xs text-muted mb-2">Parallel</p>
          <p className="text-sm font-semibold">{side.title}</p>
          <ul className="mt-2 flex flex-col gap-1 text-xs text-muted">
            {side.items.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Table({ title, head, rows }) {
  return (
    <>
      {title && <p className="text-xs text-muted mb-2">{title}</p>}
      {/* 상세 폭이 좁으면(모바일) 칸이 찌그러지므로 행마다 카드로 쌓음 */}
      <ul className="@md:hidden flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r[0]} className="clay p-3 text-sm">
            <p className="font-semibold">{r[0]}</p>
            <dl className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
              {r.slice(1).map((c, i) => (
                <Fragment key={i}>
                  <dt className="text-xs text-muted pt-0.5 whitespace-nowrap">{head[i + 1]}</dt>
                  <dd>{c}</dd>
                </Fragment>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden @md:block overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              {head.map((h) => <th key={h} className="font-medium py-2 pr-4">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-border last:border-0">
                {r.map((c, i) => <td key={i} className={`py-2.5 pr-4 ${i === 0 ? "font-semibold whitespace-nowrap" : ""}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// 비교: 문제 상황(warn)과 바뀐 구조(good)를 나란히
function Compare({ items, note }) {
  const tone = { warn: "border-[#d95926]/50", good: "border-accent bg-accent-soft" };
  return (
    <>
      <div className="grid @2xl:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className={`${box} p-4 ${tone[it.tone] ?? ""}`}>
            <p className="text-xs text-muted">{it.label}</p>
            <p className="mt-1 font-semibold">{it.title}</p>
            <ul className="mt-2 flex flex-col gap-1 text-xs text-muted">
              {it.lines.map((l) => <li key={l}>· {l}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </>
  );
}

const TYPES = { flow: Flow, funnel: Funnel, table: Table, compare: Compare };

export default function Visual({ visual }) {
  const V = TYPES[visual?.type];
  return V ? <div className="card p-5"><V {...visual} /></div> : null;
}
