import { Search } from "lucide-react";

// 출처 번호: 누르면 근거가 되는 케이스 · 섹션으로 이동(접힌 케이스는 PageEffects가 펼침)
function Cite({ n, href }) {
  return (
    <a
      href={href}
      aria-label={`출처 ${n}`}
      className="relative -top-0.5 ml-0.5 inline-grid place-items-center min-w-5 h-5 px-1 rounded-sm bg-accent-soft text-accent text-xs font-semibold tabular-nums align-middle hover:bg-accent hover:text-white transition-colors"
    >
      {n}
    </a>
  );
}

// 첫 화면: 검색창에 들어간 질의 + 출처 번호가 붙은 요약. 검색 · AI 답변 화면의 형식만 빌리고 특정 서비스 모양은 흉내 내지 않음
export default function Hero({ answer }) {
  const href = Object.fromEntries(answer.sources.map((s) => [s.n, s.href]));
  return (
    <section id="top" data-track aria-label="요약" className="scroll-mt-28 md:scroll-mt-20 pt-10 md:pt-16 lg:col-start-1">
      {/* 검색창 모양의 제목: 입력란이 아니라 페이지 제목(h1) */}
      <div className="h-14 md:h-16 px-5 md:px-6 flex items-center gap-3 rounded-full border border-border bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
        <Search size={20} className="text-muted shrink-0" aria-hidden />
        <h1 className="text-lg md:text-xl font-semibold tracking-tight truncate">{answer.query}</h1>
      </div>

      <p className="mt-8 text-sm font-semibold text-muted">요약</p>
      <p className="mt-2 max-w-[36em] text-xl md:text-2xl leading-[1.6] md:leading-[1.6] font-medium tracking-tight text-balance">
        {answer.parts.map((p, i) => {
          // 마지막 어절과 번호를 묶어 번호만 다음 줄로 떨어지지 않게
          const cut = p.text.lastIndexOf(" ") + 1;
          return (
            <span key={i}>
              {p.text.slice(0, cut)}
              <span className="whitespace-nowrap">
                {p.text.slice(cut)}
                {p.ref && <Cite n={p.ref} href={href[p.ref]} />}
              </span>
            </span>
          );
        })}
      </p>

      <ol aria-label="출처" className="mt-6 flex flex-wrap gap-2">
        {answer.sources.map((s) => (
          <li key={s.n}>
            <a href={s.href} className="h-9 pl-1.5 pr-3 inline-flex items-center gap-2 rounded-full border border-border text-sm hover:border-accent hover:text-accent transition-colors">
              <span className="size-6 grid place-items-center rounded-full bg-surface-2 text-xs font-semibold tabular-nums">{s.n}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
