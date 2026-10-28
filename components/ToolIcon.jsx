import {
  siFigma, siJira, siNotion, siGoogleanalytics, siGooglesearchconsole, siGithub, siReact, siVuedotjs, siNextdotjs, siVercel, siClaude, siModelcontextprotocol,
} from "simple-icons";
import { Workflow, SquareTerminal, Files, Bot } from "lucide-react";

// 개별 named import라 쓰는 아이콘만 번들됨. 새 도구는 여기에 추가 후 data의 icon에 slug 지정
// Slack은 simple-icons에서 빠져 공식 로고 마크(해시 모양) 경로를 직접 넣음
const SLACK = "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z";

const BRAND = Object.fromEntries(
  [siFigma, siJira, siNotion, siGoogleanalytics, siGooglesearchconsole, siGithub, siReact, siVuedotjs, siNextdotjs, siVercel, siClaude, siModelcontextprotocol].map((i) => [i.slug, i.path]).concat([["slack", SLACK]])
);
// simple-icons에 없는 브랜드(MS Office는 상표권자 요청으로 삭제, Flow·Codex는 미등록)는 일반 아이콘으로
const GENERIC = { office: Files, workflow: Workflow, terminal: SquareTerminal, bot: Bot };

// 브랜드 색 대신 currentColor: 검정 로고가 다크 모드에서 사라지지 않게
export default function ToolIcon({ icon, size = 20 }) {
  if (BRAND[icon])
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
        <path d={BRAND[icon]} />
      </svg>
    );
  const Icon = GENERIC[icon] ?? GENERIC.bot;
  return <Icon size={size} aria-hidden />;
}
