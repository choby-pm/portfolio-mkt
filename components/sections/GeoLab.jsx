import { ArrowRightLeft, NotebookPen, Ruler, Scale, History } from "lucide-react";
import { Panel, FormTable } from "@/components/Panel";
import Visual from "./Visual";
import { Status } from "./CaseStudy";

// 노트 구분 배지: 출처가 있는 사실 · 모르는 것 · 아직 검증 안 된 가설을 섞지 않게
const KIND = {
  known: { label: "알려진 것", className: "bg-ok-soft text-ok" },
  unknown: { label: "모르는 것", className: "bg-surface-2 text-muted border border-border" },
  hypothesis: { label: "가설", className: "bg-accent-soft text-accent" },
};

// 제목 줄 + 내용. Visual이 자체 카드를 그리므로 Panel로 한 번 더 감싸지 않음
function Block({ title, icon: Icon, aside, children }) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Icon size={16} className="text-accent" aria-hidden />
        {title}
        {aside && <span className="ml-auto text-xs font-normal text-muted">{aside}</span>}
      </h3>
      {children}
    </section>
  );
}

// GEO 랩: 표준이 없는 분야라 성과 대신 연구 노트(SEO → GEO, 노트, 측정 프레임, 적용 계획, 로그)
export default function GeoLab({ geo }) {
  const { plan } = geo;
  return (
    <div className="@container flex flex-col gap-6">
      <p className="max-w-3xl text-[15px] md:text-base leading-relaxed">{geo.intro}</p>

      <Block title="SEO에서 GEO로" icon={ArrowRightLeft}>
        <Visual visual={geo.bridge} />
      </Block>

      <Block title="연구 노트" icon={NotebookPen} aside="출처 없는 내용은 가설로 표시">
        <div className="grid @4xl:grid-cols-3 gap-3">
          {Object.entries(KIND).map(([kind, k]) => (
            <ul key={kind} className="card p-4 flex flex-col gap-3" aria-label={k.label}>
              <li className={`self-start px-2 h-6 inline-flex items-center rounded-xs text-xs font-medium ${k.className}`}>{k.label}</li>
              {geo.notes.filter((n) => n.kind === kind).map((n) => (
                <li key={n.text} className="text-sm leading-relaxed">{n.text}</li>
              ))}
            </ul>
          ))}
        </div>
      </Block>

      <Block title="측정 프레임 (제안)" icon={Ruler}>
        <Visual visual={geo.measure} />
      </Block>

      <Block title={plan.title} icon={Scale}>
        <Panel title="적용 대상" aside={<Status status={plan.status} />}>
          <div className="@container p-4 flex flex-col gap-4">
            <FormTable
              rows={[
                ["대상", "노동법률사무소 (익명)"],
                ["오픈", plan.open],
                ["주력 분야", plan.field ?? "—"],
                ["지역", plan.region ?? "—"],
              ]}
            />
            <Visual visual={plan.queries} />
            <Visual visual={plan.strategy} />
          </div>
        </Panel>
      </Block>

      <Block title="진행 로그" icon={History} aside="실패한 가설도 기록">
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
