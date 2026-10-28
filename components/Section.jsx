// 본문 섹션 틀: 앵커 대상 + 제목 + 한 줄 설명. 고정 상단 바 높이만큼 scroll-margin
export default function Section({ id, title, lead, className = "", children }) {
  return (
    <section id={id} data-track aria-labelledby={`${id}-title`} className={`scroll-mt-28 md:scroll-mt-20 pt-16 md:pt-24 ${className}`}>
      <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {lead && <p className="mt-2 max-w-[40em] text-muted leading-relaxed">{lead}</p>}
      <div className="mt-6 md:mt-8">{children}</div>
    </section>
  );
}
