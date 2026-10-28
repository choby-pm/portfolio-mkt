import { Plus } from "lucide-react";
import ToolIcon from "@/components/ToolIcon";

// 역량을 질문 · 답으로: 답 끝에 근거(케이스 · GEO 랩) 링크. 질문형 구성은 GEO 랩의 가설 하나를 이 페이지에 그대로 적용한 것
export default function Faq({ capabilities, skills }) {
  return (
    <>
      <div className="border-t border-border">
        {capabilities.map((c) => (
          <details key={c.title} className="group border-b border-border">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer py-4 flex items-center justify-between gap-4 text-[17px] font-medium hover:text-accent transition-colors">
              {c.q}
              <Plus size={20} className="shrink-0 text-muted transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden />
            </summary>
            <div className="pb-5 max-w-[42em] text-[15px] leading-relaxed">
              <p className="text-sm text-muted">{c.title}</p>
              <p className="mt-1">{c.desc}</p>
              <a href={`#${c.proof.case ?? c.proof.screen}`} className="mt-2 inline-block text-accent hover:underline underline-offset-4">
                근거: {c.proof.label}
              </a>
            </div>
          </details>
        ))}
      </div>

      <h3 className="mt-10 font-semibold">쓰는 도구</h3>
      <dl className="mt-3 grid sm:grid-cols-[10rem_minmax(0,1fr)] gap-x-6 gap-y-3 text-sm">
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
