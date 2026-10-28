import { Mail, Phone, MapPin } from "lucide-react";
import { GitHubMark } from "./TopActions";

// 검색 결과 옆 지식 패널 모양의 프로필: 사실 목록 + 연락처. 값이 null이면 지어내지 않고 "—" + 수치 확인 중
export default function KnowledgePanel({ profile, kpis }) {
  const github = profile.links.find((l) => l.label === "GitHub")?.url;
  const contact = "flex items-center gap-2.5 py-1.5 hover:text-accent transition-colors";
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <p className="text-2xl font-bold tracking-tight">{profile.name}</p>
      <p className="mt-1 text-muted">{profile.role}</p>

      <dl className="mt-5 pt-4 border-t border-border flex flex-col gap-3.5">
        {kpis.map((k) => (
          <div key={k.label}>
            <dt className="text-sm text-muted">{k.label}</dt>
            <dd className={`mt-0.5 text-lg font-bold tabular-nums ${k.value === null ? "text-muted" : ""}`}>
              {k.value ?? "—"}
              <span className="block text-xs font-normal text-muted">{k.value === null ? "수치 확인 중" : k.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 pt-4 border-t border-border text-sm">
        <li><a href={`mailto:${profile.email}`} className={contact}><Mail size={16} className="text-muted" aria-hidden />{profile.email}</a></li>
        <li><a href={`tel:${profile.phone}`} className={`${contact} tabular-nums`}><Phone size={16} className="text-muted" aria-hidden />{profile.phone}</a></li>
        {github && <li><a href={github} target="_blank" rel="noreferrer" className={contact}><GitHubMark />GitHub (새 창)</a></li>}
        <li className="flex items-center gap-2.5 py-1.5 text-muted"><MapPin size={16} aria-hidden />{profile.location}</li>
      </ul>
    </div>
  );
}
