import Image from "next/image";
import { IdCard, User, BriefcaseBusiness, Building2, MapPin, Mail, Phone, Layers, Target, Wrench, Briefcase, GraduationCap, Award, Plane } from "lucide-react";
import ToolIcon from "@/components/ToolIcon";
import { DeckLink } from "@/components/DeckModal";
import { CareerDocLink } from "@/components/CareerDocModal";
import { Panel, DataTable, FormTable } from "@/components/Panel";
import careerDocs from "@/data/career-docs.json";

// 도구 칩(아이콘 + 이름). AI 도구만 강조색
function ToolChip({ tool, ai }) {
  return (
    <li className={`h-6 px-2 inline-flex items-center gap-1 rounded-xs border text-xs whitespace-nowrap ${ai ? "border-transparent bg-accent-soft text-accent" : "border-border"}`}>
      <ToolIcon icon={tool.icon} size={13} />
      {tool.name}
    </li>
  );
}

// 좁은 화면은 기간을 두 줄로 줄여 나머지 칸 폭 확보
const period = { label: "기간", className: "w-20 sm:w-32 text-xs text-muted tabular-nums sm:whitespace-nowrap" };

// 기본 정보: 증명사진 | 인적 사항 양식
function BasicInfo({ profile }) {
  const link = "hover:text-accent transition-colors";
  return (
    <Panel title="기본 정보" icon={IdCard}>
      <div className="@container p-4 md:p-5 flex flex-col sm:flex-row gap-4 md:gap-5">
        {profile.photo && (
          <Image src={profile.photo} alt={profile.name} width={240} height={320} priority className="w-28 md:w-32 aspect-[3/4] shrink-0 rounded-sm border border-border object-cover object-top bg-surface-2" />
        )}
        <div className="flex-1 min-w-0">
          <FormTable
            rows={[
              ["성명", <span key="n" className="font-semibold">{profile.name}</span>, User],
              ["직무", profile.role, BriefcaseBusiness],
              ["소속", (
                <span key="c" className="inline-flex flex-wrap items-center gap-2">
                  {profile.company}
                  <span className="px-1.5 h-5 inline-flex items-center rounded-xs bg-ok-soft text-ok text-xs">재직중</span>
                </span>
              ), Building2],
              ["거주지", profile.location, MapPin],
              ["이메일", <a key="e" href={`mailto:${profile.email}`} className={link}>{profile.email}</a>, Mail],
              ["연락처", <a key="t" href={`tel:${profile.phone}`} className={`${link} tabular-nums`}>{profile.phone}</a>, Phone],
              ["도메인", profile.domain, Layers],
            ]}
          />
        </div>
      </div>
    </Panel>
  );
}

// 인사기록카드: 기본 정보 → 핵심 역량 · 보유 기술 → 경력 · 학력 · 수상 · 활동 그리드
export default function Overview({ data, onOpenCase }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg md:text-2xl font-semibold leading-snug tracking-tight whitespace-pre-line text-balance">{data.profile.tagline}</p>
      <BasicInfo profile={data.profile} />

      {/* 핵심 역량: 주장(역량 · 내용) 옆에 근거 프로젝트. 근거를 누르면 해당 프로젝트 상세로 */}
      <Panel title="핵심 역량" icon={Target}>
        <DataTable
          cols={[
            { label: "역량", className: "w-32 md:w-52 font-medium" },
            { label: "내용", className: "text-muted hidden md:table-cell" },
            { label: "근거", className: "md:w-64" },
          ]}
          rows={data.strengths.map((s) => ({
            key: s.title,
            cells: [
              s.title,
              s.desc,
              s.proof && (
                <button key="p" onClick={() => onOpenCase(s.proof.case)} className="text-left text-accent hover:underline underline-offset-2">
                  {s.proof.label}
                </button>
              ),
            ],
          }))}
        />
      </Panel>

      <div className="grid xl:grid-cols-2 gap-4 items-start">
        <Panel title="보유 기술" icon={Wrench} className="xl:col-span-2">
          <DataTable
            cols={[{ label: "구분", className: "w-36 text-muted whitespace-nowrap" }, { label: "도구" }]}
            rows={data.skills.map((s) => ({
              key: s.group,
              cells: [s.group, <ul key="t" className="flex flex-wrap gap-1">{s.items.map((t) => <ToolChip key={t.name} tool={t} ai={s.ai} />)}</ul>],
            }))}
          />
        </Panel>
      </div>

      <div className="grid xl:grid-cols-2 gap-4 items-start">
        <Panel title="경력" icon={Briefcase} aside={`${data.career.length}건`}>
          <DataTable
            cols={[period, { label: "회사" }, { label: "직무", className: "text-muted" }]}
            rows={data.career.map((c) => ({
              key: c.company,
              cells: [c.period, careerDocs[c.company] ? <CareerDocLink key="d" doc={careerDocs[c.company]}>{c.company}</CareerDocLink> : <span key="d" className="font-medium">{c.company}</span>, c.role],
            }))}
          />
        </Panel>
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
    </div>
  );
}
