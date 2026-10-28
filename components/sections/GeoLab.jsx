import Visual from "./Visual";

// 상태 배지(준비 중)
const Status = ({ status }) => <span className="shrink-0 px-2 h-6 inline-flex items-center rounded-xs text-xs whitespace-nowrap bg-accent-soft text-accent">{status.label}</span>;

// 노트 구분 배지: 출처가 있는 사실 · 모르는 것 · 아직 검증 안 된 가설을 섞지 않게
const KIND = {
  known: { label: "알려진 것", className: "bg-ok-soft text-ok" },
  unknown: { label: "모르는 것", className: "bg-surface-2 text-muted border border-border" },
  hypothesis: { label: "가설", className: "bg-accent-soft text-accent" },
};

// 제목 줄 + 내용. Visual이 자체 카드를 그리므로 한 번 더 감싸지 않음
function Block({ title, aside, children }) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h3 className="text-lg font-bold flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {title}
        {aside && <span className="text-sm font-normal text-muted">{aside}</span>}
      </h3>
      {children}
    </section>
  );
}

// GEO 랩: 표준이 없는 분야라 성과 대신 연구 노트(SEO → GEO, 노트, 측정 프레임, 적용 계획, 로그)
export default function GeoLab({ geo }) {
  const { plan } = geo;
  return (
    <div className="@container flex flex-col gap-10">
      <p className="max-w-3xl text-[15px] md:text-base leading-relaxed">{geo.intro}</p>

      <Block title="SEO에서 GEO로">
        <Visual visual={geo.bridge} />
      </Block>

      <Block title="연구 노트" aside="검증 안 된 내용은 가설로 표시">
        {/* 구분 배지 | 노트 목록을 구분선 행으로: 상자를 겹치지 않고 가볍게 */}
        <div className="border-t border-border">
          {Object.entries(KIND).map(([kind, k]) => (
            <div key={kind} className="py-5 border-b border-border grid sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-6 gap-y-3">
              <h4><span className={`px-2 h-6 inline-flex items-center rounded-xs text-xs font-medium ${k.className}`}>{k.label}</span></h4>
              <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
                {geo.notes.filter((n) => n.kind === kind).map((n) => <li key={n.text}>{n.text}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block title="측정 프레임 (제안)">
        <Visual visual={geo.measure} />
      </Block>

      <Block title={plan.title}>
        <div className="flex flex-col gap-4">
          {/* 아직 정해지지 않은 값은 "—" */}
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {[
              ["상태", <Status key="s" status={plan.status} />],
              ["대상", "노동법률사무소 (익명)"],
              ["오픈", plan.open],
              ["주력 분야", plan.field ?? "—"],
              ["지역", plan.region ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <Visual visual={plan.queries} />
          <Visual visual={plan.strategy} />
        </div>
      </Block>

      <Block title="진행 로그" aside="실패한 가설도 기록">
        <ol className="card divide-y divide-border">
          {geo.log.map((l) => (
            <li key={l.text} className="px-4 py-3 flex gap-4 text-sm">
              <span className="w-16 shrink-0 text-xs text-muted tabular-nums pt-0.5">{l.date}</span>
              {l.text}
            </li>
          ))}
        </ol>
      </Block>
    </div>
  );
}
