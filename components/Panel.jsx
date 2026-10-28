import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

// ERP 업무 화면의 공용 틀: 제목 줄 있는 패널, 머리줄 + 행 그리드, 라벨 칸 | 값 칸 양식

// icon: 제목 앞 lucide 아이콘 컴포넌트(선택)
export function Panel({ title, icon: Icon, aside, children, className = "" }) {
  return (
    <section aria-label={title} className={`card overflow-hidden ${className}`}>
      <header className="px-4 h-10 flex items-center justify-between gap-3 border-b border-border bg-surface-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          {Icon && <Icon size={16} className="text-accent" aria-hidden />}
          {title}
        </h3>
        {aside && <span className="text-xs text-muted">{aside}</span>}
      </header>
      {children}
    </section>
  );
}

// cols: [{ label, className }] · rows: [{ key, cells: [node] }]. 칸 className은 머리줄과 행에 같이 붙음
export function DataTable({ cols, rows }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-muted text-left">
          {cols.map((c) => <th key={c.label} className={`font-medium px-3 sm:px-4 py-2 ${c.className ?? ""}`}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className="border-t border-border">
            {r.cells.map((cell, i) => <td key={i} className={`px-3 sm:px-4 py-2.5 align-top ${cols[i].className ?? ""}`}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// rows: [라벨, 값, 아이콘?]. 가장 가까운 @container 폭이 넓으면 한 줄에 두 쌍. 쌍 수가 홀수면 마지막 값이 줄을 채움
export function FormTable({ rows }) {
  return (
    <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] @2xl:grid-cols-[6.5rem_minmax(0,1fr)_6.5rem_minmax(0,1fr)] gap-px bg-border border border-border rounded-sm overflow-hidden text-sm">
      {rows.map(([k, v, Icon], i) => (
        <div key={k} className={`contents ${i === rows.length - 1 && rows.length % 2 ? "@2xl:[&>dd]:col-span-3" : ""}`}>
          <dt className="bg-surface-2 px-3 py-2 text-xs text-muted flex items-center gap-1.5">
            {Icon && <Icon size={14} className="shrink-0" aria-hidden />}
            {k}
          </dt>
          <dd className="bg-surface px-3 py-2 min-w-0 [overflow-wrap:anywhere]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// 상세 화면 상단 줄: 목록으로 · 몇 번째 레코드인지 · 이전/다음 레코드 (ERP 레코드 이동 버튼)
export function RecordBar({ index, total, onBack, onPrev, onNext, prevLabel, nextLabel }) {
  const btn = "h-9 px-3 inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface text-sm text-muted hover:text-text disabled:opacity-40 disabled:hover:text-muted";
  return (
    <div className="flex items-center gap-2">
      <button onClick={onBack} className={btn}>
        <ArrowLeft size={16} aria-hidden />목록
      </button>
      <span className="ml-auto text-xs text-muted tabular-nums" aria-label={`${total}개 중 ${index + 1}번째`}>{index + 1} / {total}</span>
      <button onClick={onPrev} disabled={!onPrev} className={btn} aria-label={prevLabel ? `이전: ${prevLabel}` : "이전 없음"}>
        <ChevronLeft size={16} aria-hidden /><span className="hidden sm:inline">이전</span>
      </button>
      <button onClick={onNext} disabled={!onNext} className={btn} aria-label={nextLabel ? `다음: ${nextLabel}` : "다음 없음"}>
        <span className="hidden sm:inline">다음</span><ChevronRight size={16} aria-hidden />
      </button>
    </div>
  );
}

// 분석 콘솔 스코어카드: 값을 크게, 라벨은 작게. 값이 null이면 지어내지 않고 "—" + 수치 확인 중
// items: [{ label, value: string | null, note? }]. 가장 가까운 @container 폭에 맞춰 2칸 → 한 줄
export function Scorecard({ items }) {
  return (
    <dl className="grid grid-cols-2 @2xl:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2 @2xl:gap-3">
      {items.map((m) => (
        <div key={m.label} className="clay border-l-2 border-l-accent px-3 py-3 @2xl:px-4 flex flex-col">
          <dt className="order-2 mt-1 text-xs text-muted">{m.label}</dt>
          <dd className={`text-lg @2xl:text-2xl font-bold tabular-nums leading-tight ${m.value === null ? "text-muted" : ""}`}>{m.value ?? "—"}</dd>
          <dd className="order-3 mt-0.5 text-[11px] text-muted">{m.value === null ? "수치 확인 중" : m.note}</dd>
        </div>
      ))}
    </dl>
  );
}
