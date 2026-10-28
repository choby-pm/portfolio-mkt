import { Mail, Phone, MapPin, Gauge, Target, Wrench } from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { Panel, DataTable, Scorecard } from "@/components/Panel";

// 도구 칩(아이콘 + 이름). AI 도구만 강조색
function ToolChip({ tool, ai }) {
  return (
    <li className={`h-6 px-2 inline-flex items-center gap-1 rounded-xs border text-xs whitespace-nowrap ${ai ? "border-transparent bg-accent-soft text-accent" : "border-border"}`}>
      <ToolIcon icon={tool.icon} size={13} />
      {tool.name}
    </li>
  );
}

// 개요: 한 줄 소개 · 연락처 → KPI 스코어카드 → 채널별 역량(근거 → 캠페인 상세 또는 GEO 랩) → 도구
export default function Overview({ data, onOpenCase, onGo }) {
  const { profile } = data;
  const link = "inline-flex items-center gap-1.5 hover:text-accent transition-colors";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-lg md:text-2xl font-semibold leading-snug tracking-tight whitespace-pre-line text-balance">{profile.tagline}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <a href={`mailto:${profile.email}`} className={link}><Mail size={14} aria-hidden />{profile.email}</a>
          <a href={`tel:${profile.phone}`} className={`${link} tabular-nums`}><Phone size={14} aria-hidden />{profile.phone}</a>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden />{profile.location}</span>
        </p>
      </div>

      <Panel title="핵심 지표" icon={Gauge}>
        <div className="@container p-4">
          <Scorecard items={data.kpis} />
        </div>
      </Panel>

      {/* 채널별 역량: 주장(역량 · 내용) 옆에 근거. 근거를 누르면 해당 캠페인 상세나 GEO 랩으로 */}
      <Panel title="채널별 역량" icon={Target}>
        <DataTable
          cols={[
            { label: "역량", className: "w-32 md:w-44 font-medium" },
            { label: "내용", className: "text-muted hidden md:table-cell" },
            { label: "근거", className: "md:w-52" },
          ]}
          rows={data.capabilities.map((c) => ({
            key: c.title,
            cells: [
              c.title,
              c.desc,
              <button
                key="p"
                onClick={() => (c.proof.case ? onOpenCase(c.proof.case) : onGo(c.proof.screen))}
                className="text-left text-accent hover:underline underline-offset-2"
              >
                {c.proof.label}
              </button>,
            ],
          }))}
        />
      </Panel>

      <Panel title="도구" icon={Wrench}>
        <DataTable
          cols={[{ label: "구분", className: "w-36 text-muted whitespace-nowrap" }, { label: "도구" }]}
          rows={data.skills.map((s) => ({
            key: s.group,
            cells: [s.group, <ul key="t" className="flex flex-wrap gap-1">{s.items.map((t) => <ToolChip key={t.name} tool={t} ai={s.ai} />)}</ul>],
          }))}
        />
      </Panel>
    </div>
  );
}
