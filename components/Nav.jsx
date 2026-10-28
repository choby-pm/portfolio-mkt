"use client";

import { useState } from "react";
import { PanelLeftClose } from "lucide-react";

// BY 로고: 마스크 이미지에 강조색을 칠해 표시
function Logo() {
  return (
    <span
      aria-hidden
      className="block w-9 shrink-0 aspect-[219/202] bg-accent"
      style={{ mask: "url(/logo-mask.png) center / contain no-repeat", WebkitMask: "url(/logo-mask.png) center / contain no-repeat" }}
    />
  );
}

// lg(≥1024): 라벨 있는 사이드 패널(접으면 아이콘 레일) / md(768–1023): 아이콘 레일 / <768: 하단 탭바
// lg: 클래스는 펼친 상태일 때만 붙여, 접힌 lg는 md 레일과 같은 모양이 됨
export function SideNav({ sections, active, onSelect, name, role }) {
  const [collapsed, setCollapsed] = useState(false);
  const wide = !collapsed;

  return (
    // 패널로 띄움. 바깥 여백(ml-3)만큼 폭을 줄여 본문 폭은 이전과 같게 유지 (풀사이즈 레이아웃 기준 폭에 영향 없음)
    <aside className={`hidden md:flex flex-col shrink-0 my-3 ml-3 w-[60px] ${wide ? "lg:w-[228px]" : ""} card overflow-hidden transition-[width]`}>
      <div className={`h-16 flex items-center justify-center ${wide ? "lg:justify-between lg:px-5" : ""} border-b border-border`}>
        <div className="flex items-center gap-2.5">
          {/* 접힌 상태에선 접기 버튼 대신 로고를 눌러 펼침. md 레일은 항상 접힌 모양이라 lg에서만 누를 수 있음 */}
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="사이드바 펼치기"
              aria-expanded={false}
              title="사이드바 펼치기"
              className="pointer-events-none lg:pointer-events-auto hover:opacity-80 transition-opacity"
            >
              <Logo />
            </button>
          ) : (
            <Logo />
          )}
          <div className={`hidden ${wide ? "lg:block" : ""} leading-tight`}>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-muted">{role}</p>
          </div>
        </div>
        {wide && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="사이드바 접기"
            aria-expanded
            title="사이드바 접기"
            className="hidden lg:grid size-8 place-items-center clay text-muted hover:text-text"
          >
            <PanelLeftClose size={18} aria-hidden />
          </button>
        )}
      </div>
      <nav aria-label="섹션" className={`flex flex-col gap-1 p-2 ${wide ? "lg:p-3" : ""}`}>
        {sections.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              aria-current={on ? "page" : undefined}
              aria-label={label}
              title={label}
              className={`flex items-center justify-center ${wide ? "lg:justify-start lg:px-3" : ""} gap-3 h-10 rounded-sm text-sm transition-colors ${
                on ? "bg-accent-soft text-accent font-medium shadow-[inset_3px_0_0_var(--accent)]" : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              <Icon size={20} aria-hidden />
              <span className={`hidden ${wide ? "lg:inline" : ""}`}>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function BottomNav({ sections, active, onSelect }) {
  return (
    <nav
      aria-label="섹션"
      className="md:hidden shrink-0 grid border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
    >
      {sections.map(({ id, short, icon: Icon }) => {
        const on = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            aria-current={on ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 h-16 text-[11px] ${on ? "text-accent font-medium" : "text-muted"}`}
          >
            <Icon size={20} aria-hidden />
            {short}
          </button>
        );
      })}
    </nav>
  );
}
