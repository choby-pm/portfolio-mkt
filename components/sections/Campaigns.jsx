import CaseStudy, { Status } from "./CaseStudy";
import { RecordBar } from "@/components/Panel";

// "2026.04 - 2026.09" → "26.04–26.09": 그리드 기간 칸을 한 줄로
const shortPeriod = (p) => p.replace(/20(\d\d)\./g, "$1.").replace(" - ", "–");

// 캠페인 표: 행을 누르면 상세 화면. 넓을수록 칸(고객사 · 역할)이 늘어남. 하단 줄은 조회 결과 요약
function CampaignGrid({ campaigns, onOpen }) {
  const live = campaigns.filter((p) => p.status.kind === "live").length;
  const channels = new Set(campaigns.flatMap((p) => p.channel.split(" · "))).size;
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-2 text-xs text-muted text-left">
            <th className="font-medium px-4 py-2.5">캠페인</th>
            <th className="font-medium px-4 py-2.5 hidden sm:table-cell">채널</th>
            <th className="font-medium px-4 py-2.5 hidden md:table-cell">고객사</th>
            <th className="font-medium px-4 py-2.5 hidden lg:table-cell">역할</th>
            <th className="font-medium px-2 py-2.5">상태</th>
            <th className="font-medium px-4 py-2.5 text-right">기간</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((p) => (
            // 행 전체를 누를 수 있게 제목 버튼을 행 크기로 늘림
            <tr key={p.id} className="relative border-t border-border hover:bg-surface-2 transition-colors">
              <td className="px-4 py-3 align-top">
                <button onClick={() => onOpen(p.id)} className="text-left font-medium hover:text-accent after:absolute after:inset-0">
                  {p.title}
                </button>
                <p className="mt-0.5 text-xs text-muted">{p.summary}</p>
              </td>
              <td className="px-4 py-3 align-top text-muted hidden sm:table-cell whitespace-nowrap">{p.channel}</td>
              <td className="px-4 py-3 align-top text-muted hidden md:table-cell">{p.client}</td>
              <td className="px-4 py-3 align-top text-muted hidden lg:table-cell">{p.role}</td>
              <td className="px-2 py-3 align-top"><Status status={p.status} /></td>
              <td className="px-4 py-3 align-top text-right text-xs text-muted tabular-nums whitespace-nowrap">{shortPeriod(p.period)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="h-10 px-4 border-t border-border bg-surface-2 text-xs text-muted flex items-center gap-2 [&>span+span]:before:content-['·'] [&>span+span]:before:mr-2">
        <span>조회 {campaigns.length}건</span>
        <span>채널 {channels}종</span>
        {live > 0 && <span>운영 중 {live}건</span>}
      </p>
    </div>
  );
}

// 목록 화면 ↔ 상세 화면. 상세는 상단 줄에서 목록 · 이전/다음 캠페인으로 이동
export default function Campaigns({ campaigns, openId, onOpen, onBack }) {
  const i = campaigns.findIndex((p) => p.id === openId);
  if (i < 0) return <CampaignGrid campaigns={campaigns} onOpen={onOpen} />;
  const prev = campaigns[i - 1], next = campaigns[i + 1];
  return (
    <div className="flex flex-col gap-4">
      <RecordBar
        index={i}
        total={campaigns.length}
        onBack={onBack}
        onPrev={prev && (() => onOpen(prev.id))}
        onNext={next && (() => onOpen(next.id))}
        prevLabel={prev?.title}
        nextLabel={next?.title}
      />
      <CaseStudy key={campaigns[i].id} p={campaigns[i]} />
    </div>
  );
}
