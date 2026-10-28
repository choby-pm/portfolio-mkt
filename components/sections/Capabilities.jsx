import ToolIcon from "@/components/ToolIcon";

// 역량: 이름 | 설명 + 근거 케이스 링크를 구분선 행으로. 아래에 쓰는 도구
export default function Capabilities({ capabilities, skills }) {
  return (
    <>
      <dl className="border-t border-border">
        {capabilities.map((c) => (
          <div key={c.title} className="py-5 border-b border-border grid md:grid-cols-[12rem_minmax(0,1fr)] gap-x-8 gap-y-1.5">
            <dt className="font-semibold">{c.title}</dt>
            <dd className="max-w-[40em] text-[15px] leading-relaxed">
              {c.desc}{" "}
              <a href={`#${c.proof.case ?? c.proof.screen}`} className="text-accent whitespace-nowrap hover:underline underline-offset-4">
                근거: {c.proof.label}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-12 text-lg font-bold">쓰는 도구</h3>
      <dl className="mt-4 grid md:grid-cols-[12rem_minmax(0,1fr)] gap-x-8 gap-y-3 text-sm">
        {skills.map((s) => (
          <div key={s.group} className="contents">
            <dt className="text-muted pt-1">{s.group}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {s.items.map((t) => (
                  <li key={t.name} className={`h-7 px-2.5 inline-flex items-center gap-1.5 rounded-full border text-[13px] ${s.ai ? "border-transparent bg-accent-soft text-accent" : "border-border"}`}>
                    <ToolIcon icon={t.icon} size={13} />
                    {t.name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
