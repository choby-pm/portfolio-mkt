import TopActions from "./TopActions";

export const NAV = [
  { id: "cases", label: "케이스" },
  { id: "capabilities", label: "역량" },
  { id: "geo", label: "GEO 랩" },
  { id: "career", label: "경력" },
  { id: "contact", label: "문의" },
];

// 상단 고정 바: 이름(맨 위로) · 섹션 앵커 · GitHub · 테마. 모바일은 앵커가 아래 줄에서 가로 스크롤
export default function TopBar({ profile }) {
  const link = "shrink-0 h-9 px-3 inline-flex items-center rounded-full text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors";
  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1040px] px-4 md:px-8 flex flex-wrap md:flex-nowrap items-center gap-x-4">
        <a href="#top" className="h-14 inline-flex items-center gap-2 font-bold">
          <span
            aria-hidden
            className="block w-7 aspect-[219/202] bg-accent"
            style={{ mask: "url(/logo-mask.png) center / contain no-repeat", WebkitMask: "url(/logo-mask.png) center / contain no-repeat" }}
          />
          {profile.name}
        </a>
        <nav aria-label="섹션" className="order-3 md:order-none w-full md:w-auto md:ml-4 -mx-1 pb-2 md:pb-0 flex gap-1 overflow-x-auto no-scrollbar">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className={link}>{n.label}</a>)}
        </nav>
        <TopActions profile={profile} />
      </div>
    </header>
  );
}
