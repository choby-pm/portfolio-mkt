"use client";

import { useState } from "react";
import { Send, FileDown } from "lucide-react";
import { pageview } from "@vercel/analytics";
import { track } from "@/lib/gtag";

// 서버(/api/contact)에서 Resend로 발송. 상태: idle | sending | sent | error
export default function Contact({ profile }) {
  const [state, setState] = useState("idle");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(res.status);
      pageview({ path: "/out/email" });
      track("submit_contact");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  };

  const field = "card w-full px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent";

  return (
    // flex-1: 섹션 남은 높이까지 늘어나고, 그 안에서 내용 칸이 나머지를 채움
    <div className="flex-1 flex flex-col gap-4">
      <p className="text-muted">프로젝트 협업이나 채용 관련 문의를 남겨 주시면 확인 후 회신드리겠습니다.</p>
      <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm">
            회사명
            <input name="company" required maxLength={50} autoComplete="organization" className={field} placeholder="회사명" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            이메일
            <input name="email" type="email" required maxLength={100} autoComplete="email" className={field} placeholder="you@company.com" />
          </label>
        </div>
        <label className="flex-1 flex flex-col gap-1.5 text-sm">
          문의 내용
          <textarea name="message" required maxLength={5000} className={`${field} flex-1 min-h-40 resize-none`} placeholder="문의 내용을 입력해 주세요." />
        </label>
        {/* 봇 차단용 숨김 필드: 사람은 보지도 채우지도 않음 */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={state === "sending"} className="h-11 px-5 rounded-sm bg-accent text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
            <Send size={16} aria-hidden /> {state === "sending" ? "등록 중…" : "문의 등록"}
          </button>
          <p role="status" className="text-sm">
            {state === "sent" && <span className="text-accent">문의가 접수되었습니다. 확인 후 회신드리겠습니다.</span>}
            {state === "error" && <span className="text-red-500">전송에 실패했습니다. 아래 이메일로 직접 문의해 주세요.</span>}
          </p>
        </div>
        <p className="text-xs text-muted">입력하신 회사명 · 이메일 · 문의 내용은 회신을 위해 메일로만 전달되며, 사이트에 따로 저장되지 않습니다.</p>
      </form>
      <p className="text-xs text-muted">
        전송이 원활하지 않을 경우 <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-2">{profile.email}</a>로 문의해 주세요.
      </p>
      <p className="text-xs text-muted">
        방문 통계를 위해 Google Analytics가 쿠키로 이용 정보(방문 경로 · 기기 · 본 화면)를 수집합니다. 수집을 원하지 않으면{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">Google 애널리틱스 차단 부가 기능</a>을 설치해 거부할 수 있습니다.
      </p>
      {profile.resumeUrl && (
        <a href={profile.resumeUrl} download onClick={() => pageview({ path: "/out/resume" })} className="card p-4 flex items-center gap-3 hover:border-accent transition-colors">
          <FileDown size={20} className="text-accent" aria-hidden />
          <span className="font-medium">Resume PDF</span>
        </a>
      )}
    </div>
  );
}
