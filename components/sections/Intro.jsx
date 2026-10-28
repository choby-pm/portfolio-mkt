import { Mail, Phone } from "lucide-react";
import { GitHubMark } from "@/components/TopActions";

// 첫 화면: 포지셔닝 문장이 제목(h1), 그 아래 사실 몇 줄과 연락처. 값이 null이면 지어내지 않고 "—" + 수치 확인 중
export default function Intro({ profile, kpis }) {
  const github = profile.links.find((l) => l.label === "GitHub")?.url;
  const link = "inline-flex items-center gap-2 hover:text-accent transition-colors";
  return (
    <section id="top" data-track aria-label="소개" className="scroll-mt-20 pt-14 md:pt-24">
      <p className="font-medium text-muted">{profile.name} · {profile.role}</p>
      <h1 className="mt-4 max-w-[22em] text-[28px] md:text-[44px] font-bold leading-[1.3] tracking-tight whitespace-pre-line text-balance">{profile.tagline}</h1>

      <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
        <a href={`mailto:${profile.email}`} className={link}><Mail size={17} className="text-muted" aria-hidden />{profile.email}</a>
        <a href={`tel:${profile.phone}`} className={`${link} tabular-nums`}><Phone size={17} className="text-muted" aria-hidden />{profile.phone}</a>
        {github && <a href={github} target="_blank" rel="noreferrer" className={link}><GitHubMark />GitHub (새 창)</a>}
      </p>

      <dl className="mt-12 md:mt-16 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
        {kpis.map((k) => (
          <div key={k.label}>
            <dt className="text-sm text-muted">{k.label}</dt>
            <dd className={`mt-1 text-xl md:text-2xl font-bold tabular-nums ${k.value === null ? "text-muted" : ""}`}>
              {k.value ?? "—"}
              <span className="block mt-0.5 text-xs font-normal text-muted">{k.value === null ? "수치 확인 중" : k.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
