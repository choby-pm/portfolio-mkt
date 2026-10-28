"use client";

import { FileDown, Moon, Sun } from "lucide-react";
import { pageview } from "@vercel/analytics";

// lucide v1은 브랜드 아이콘이 없어 GitHub 마크를 직접 그림
export const GitHubMark = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4 18.3 4.3 18.3 4.3c.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

const SHOW_PDF = false;

// 각 화면 제목 줄 오른쪽에 놓는 버튼(고정 · 플로팅 아님): 스크롤하면 제목과 함께 올라가 사라짐. 모바일은 아이콘만
export default function TopActions({ profile }) {
  const github = profile.links.find((l) => l.label === "GitHub")?.url;
  const btn =
    "h-8 px-2 md:px-2.5 flex items-center gap-1.5 rounded-sm text-sm text-muted hover:text-text hover:bg-surface-2 transition-colors";

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <div className="ml-auto flex items-center gap-1">
      {/* PDF 버튼은 당분간 화면에서 숨김: SHOW_PDF를 true로 바꾸면 다시 노출 */}
      {SHOW_PDF && (profile.portfolioPdf ? (
        <a href={profile.portfolioPdf} download onClick={() => pageview({ path: "/out/portfolio-pdf" })} className={btn} aria-label="포트폴리오 PDF 다운로드">
          <FileDown size={18} aria-hidden />
          <span className="hidden md:inline">PDF</span>
        </a>
      ) : (
        // shortcut: PDF 파일 전까지 비활성 표시, data/portfolio.json의 portfolioPdf 채우면 자동 활성
        <span className={`${btn} opacity-50 cursor-not-allowed`} aria-disabled="true" title="PDF 준비 중">
          <FileDown size={18} aria-hidden />
          <span className="hidden md:inline">PDF</span>
        </span>
      ))}
      {github && (
        <a href={github} target="_blank" rel="noreferrer" onClick={() => pageview({ path: "/out/github" })} className={btn} aria-label="GitHub (새 창)">
          <GitHubMark />
          <span className="hidden md:inline">GitHub</span>
        </a>
      )}
      <button onClick={toggleTheme} className={btn} aria-label="다크 모드 전환" title="다크 모드 전환">
        <Moon size={18} className="dark:hidden" aria-hidden />
        <Sun size={18} className="hidden dark:block" aria-hidden />
        <span className="hidden md:inline">Theme</span>
      </button>
    </div>
  );
}
