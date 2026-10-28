# 그로스 · GEO 마케터 포트폴리오 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PM 포트폴리오(PFD)를 복사해 GEO · 그로스 마케터용 5화면 분석 콘솔 사이트를 만들고 `choby-pm/portfolio-mkt`로 푸시한다.

**Architecture:** 원본의 Dashboard(스냅 스크롤 · 휠 핸들러) · Panel · CaseStudy · Career · Contact · Visual을 그대로 쓰고, 화면 목록 · 데이터 · 패널 모양만 바꾼다. 콘텐츠는 전부 `data/portfolio.json` · `data/career-docs.json`에 두고, 수치가 없는 칸은 `null`로 두어 공용 `Scorecard`가 "—"로 그린다.

**Tech Stack:** Next.js 16.4.2 App Router(코드 쓰기 전 `node_modules/next/dist/docs/` 확인, AGENTS.md), React 19.3, Tailwind v4, lucide-react, @vercel/analytics, Resend(fetch).

**Spec:** `docs/superpowers/specs/2026-10-28-growth-portfolio-design.md`

## Global Constraints

- 작업 폴더 `C:\Users\jby91\portfolio-mkt`, 원본 `C:\Users\jby91\portfolio\PFD`(읽기만)
- 데이터에 없는 수치 · 사실 금지. 없는 값은 `null` → 화면에 "—" + "수치 확인 중"
- 한국어 띄어쓰기 · 맞춤법 교정, 가운뎃점은 " · "(앞뒤 공백)
- 강조색 `#1a6bff`, Pretendard만, 1px 테두리 패널, 라이트 기본 · 다크 토글
- 화면 id · 이름: overview 개요 / campaigns 캠페인 / geo GEO 랩 / career 경력 / contact 문의
- 커밋 메시지 끝: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`, 태스크마다 커밋 후 `git push`
- 각 UI 태스크는 커밋 전 브라우저 패널에서 데스크톱(1440) · 375px 모바일, 라이트 · 다크 확인

## Review Focus

1. `GA_ID`가 빈 문자열 → 운영 빌드에서도 gtag 스크립트가 로드되지 않고 `track()`은 조용히 무시 (Task 1 검증)
2. 지표 값 `null` → "null" · "undefined" · 빈 칸이 아니라 "—"와 "수치 확인 중" (Task 3 check-data + 화면 확인)
3. 375px에서 하단 탭바 5칸(개요 · 캠페인 · GEO · 경력 · 문의) 라벨이 줄바꿈 · 잘림 없음 (Task 2)
4. 역량 표의 근거 링크가 없는 케이스 id를 가리킴 → 클릭해도 빈 화면 (Task 3 check-data에서 assert)
5. GEO 랩 · 경력처럼 긴 화면에서 휠: 내부 스크롤이 끝까지 간 뒤에만 다음 화면으로(EDGE_PAUSE 유지) (Task 5 · 6 확인)

---

### Task 1: 복사 · 저장소 · 분석 기본값

**Files:**
- Copy: `PFD/*` → `portfolio-mkt/` (제외: `.git .next node_modules .vercel .env.local .claude .playwright-mcp`)
- Modify: `package.json`(name `portfolio-mkt`), `lib/gtag.js`, `app/layout.js`
- Create: `scripts/check-data.mjs`, `package.json` script `"check": "node scripts/check-data.mjs"`

**Interfaces:**
- Produces: `GA_ID = ""`(lib/gtag.js), `npm run check`(Task 3 · 4 · 5가 assert를 덧붙임)

- [ ] **Step 1:** `robocopy C:\Users\jby91\portfolio\PFD C:\Users\jby91\portfolio-mkt /E /XD .git .next node_modules .vercel .claude .playwright-mcp /XF .env.local` (기존 `docs/`는 유지), `npm install`
- [ ] **Step 2:** `lib/gtag.js`: `GA_ID = ""`, 주석 "새 GA4 속성 측정 ID를 받으면 입력, 비어 있으면 GA 미로드". `app/layout.js`: 조건을 `process.env.NODE_ENV === "production" && GA_ID`로
- [ ] **Step 3:** `scripts/check-data.mjs`: `node:assert`로 `data/portfolio.json`을 읽어 JSON 파싱만 확인하는 골격(뒤 태스크가 assert 추가)
- [ ] **Step 4:** `npm run check && npm run build` → 둘 다 성공. `npm start` 후 `curl -s localhost:3000 | grep -c googletagmanager` → `0`
- [ ] **Step 5:** 커밋 `chore: copy PM portfolio as growth portfolio base`, `gh repo create choby-pm/portfolio-mkt --public --source . --push`

### Task 2: 콘솔 셸(5화면 · 상단 바 · 내비)

**Files:**
- Modify: `components/Dashboard.jsx`(SECTIONS, render), `components/TopActions.jsx`, `components/Nav.jsx`
- Create: `components/sections/GeoLab.jsx`(이 태스크에선 `return null` 자리), `components/sections/Campaigns.jsx`(`Projects.jsx` 이름 변경)

**Interfaces:**
- Produces: `SECTIONS` = `[{id:"overview",label:"개요",short:"개요",icon:LayoutDashboard},{id:"campaigns",label:"캠페인",short:"캠페인",icon:Megaphone},{id:"geo",label:"GEO 랩",short:"GEO",icon:Sparkles},{id:"career",label:"경력",short:"경력",icon:Route},{id:"contact",label:"문의",short:"문의",icon:Mail}]`
- Produces: `<GeoLab geo={data.geo} />`, `<Campaigns campaigns={data.campaigns} openId onOpen onBack />`(원본 Projects와 같은 props, `projects`→`campaigns`)
- Dashboard의 `open.projects` · `/case/` pageview 경로는 `campaigns`로 바꿈

- [ ] **Step 1:** SECTIONS 교체, render에 `campaigns` · `geo` 분기, 상세 잠금 조건 `open.campaigns || open.career`
- [ ] **Step 2:** 상단 바: 각 화면 제목 줄 TopActions 왼쪽에 속성 칩 "조병윤 · Growth"와 기간 칩 "2020.11 – 현재"(`clay` 작은 칩, md 이상만 표시)
- [ ] **Step 3:** `npm run build` 성공, 브라우저에서 5화면 휠 · 내비 이동, 375px 하단 탭 5칸 한 줄(Review Focus 3)
- [ ] **Step 4:** 커밋 `feat: five-screen analytics console shell`, push

### Task 3: 개요

**Files:**
- Modify: `components/Panel.jsx`(Scorecard 추가), `components/sections/Overview.jsx`(전면 교체), `data/portfolio.json`(profile · kpis · capabilities · skills), `scripts/check-data.mjs`

**Interfaces:**
- Produces: `Scorecard({ items: [{ label: string, value: string|null, note?: string }] })` — `value === null`이면 값 자리에 "—", note 자리에 "수치 확인 중". Task 4 CaseStudy 지표 타일도 이것을 씀
- Data: `profile.role = "그로스 마케터"`, `profile.tagline` = spec 초안 문구, `profile.photo` 삭제. `kpis`: `[{label:"마케팅 · SEO 경력", value:"auto"}, {label:"SEO 운영 국가", value:"26개국"}, {label:"주요 키워드 SERP 1페이지", value:"대부분", note:"노출되지 않던 홈페이지 기준"}, {label:"—", value:null}]` (`"auto"`는 Overview가 `spans()`로 field ∈ {SEO, 마케팅} 회사 개월 합계를 `formatMonths`로 표시). `capabilities`: `[{title, desc, proof?:{label, case}}]` 행 5개(검색광고 · 퍼포먼스 / SEO / 측정 · 분석 설계 / 웹 구현 / GEO(준비 중)), GEO 행의 proof는 `{label:"GEO 랩", screen:"geo"}`
- 원본 `strengths` · 기본 정보 카드 · 학력/수상/활동 패널은 Overview에서 제거(Task 6이 경력으로 옮김)

- [ ] **Step 1: check-data assert 추가** — `capabilities[].proof.case`가 모두 `campaigns[].id`에 존재, `kpis`와 모든 `campaigns[].metrics`의 value는 문자열 또는 `null`(빈 문자열 금지)
- [ ] **Step 2:** `npm run check` → campaigns 미존재로 FAIL 확인(Task 4 전이므로 case 참조는 Task 4에서 통과; 이 단계에선 proof 없이 두거나 Task 4 id를 미리 씀 — 미리 쓰고 FAIL 확인)
- [ ] **Step 3:** Scorecard, Overview(소개 → Scorecard → 역량 DataTable → 도구 칩) 구현. 근거 클릭: `case`면 `onOpenCase(id)`, `screen`이면 `goTo(screen)` — Dashboard가 `onGo` prop 추가 전달
- [ ] **Step 4:** 데스크톱 · 375px · 다크에서 "—" 칸 확인(Review Focus 2), `npm run build`
- [ ] **Step 5:** 커밋 `feat: overview scorecards and channel capabilities`, push (check FAIL이면 Task 4 후 함께 커밋)

### Task 4: 캠페인

**Files:**
- Modify: `components/sections/Campaigns.jsx`, `components/sections/CaseStudy.jsx`, `data/portfolio.json`(`projects` → `campaigns`)

**Interfaces:**
- Consumes: `Scorecard`(Task 3)
- Data: `campaigns` 3건, id `groundk-seo` · `samsung-seo` · `measurement`, 원본 project 필드 형태 유지 + `channel: string`. `metrics`: groundk-seo `[{label:"노출 홈페이지",value:null},{label:"주요 키워드",value:null},{label:"광고 예산",value:null}]`, samsung-seo `[{label:"운영 국가",value:"26개국"},{label:"담당 키워드",value:null},{label:"트래픽 변화",value:null}]`, measurement `[{label:"GA4 이벤트",value:"5종"},{label:"분석 도구",value:"2종"}]`
- 내용 출처: groundk-seo · samsung-seo는 PFD `data/career-docs.json`의 그라운드케이 "광고 · SEO 기획 및 운영", 아티언스 duties 문장만. measurement는 PFD `lib/gtag.js` · `components/VercelAnalytics.jsx` · 이벤트 5종 · UTM 규칙(`utm_source` / `utm_medium=referral` / `utm_campaign=회사`)
- visual: groundk-seo flow(경쟁 분석 → 키워드 전략 → 콘텐츠 · 소재 → 통합 운영 → 성과 분석), samsung-seo flow(다국어 전략 → 진단 → 우선순위 → 모니터링 · 리포팅), measurement table(head `["이벤트","파라미터","목적"]`, 실제 코드의 이벤트 5종)

- [ ] **Step 1:** `npm run check` FAIL(Task 3 assert) 확인 후 데이터 작성 → PASS
- [ ] **Step 2:** 목록 열: 캠페인 · 채널 · 고객사(md+) · 역할(lg+) · 상태 · 기간, 하단 "조회 3건 · 채널 N종"(채널 종류 수 계산)
- [ ] **Step 3:** CaseStudy: 지표 타일을 Scorecard로, 상세 섹션 탭 라벨 개요 · 실행 · 결과(서비스 구성 섹션은 `p.service` 없으면 숨김 — 원본 동작 확인)
- [ ] **Step 4:** 개요 근거 링크 → 해당 상세 열림, 이전/다음 이동, 375px 표 → 카드 전환 확인. `npm run build`
- [ ] **Step 5:** 커밋 `feat: campaign list and case details`, push

### Task 5: GEO 랩

**Files:**
- Modify: `components/sections/GeoLab.jsx`, `data/portfolio.json`(`geo`), `scripts/check-data.mjs`

**Interfaces:**
- Data: `geo = { title:"노동법률사무소 홈페이지 GEO 계획", status:{kind:"plan",label:"준비 중"}, open:"미정", field:null, region:null, why:string, queries:{head:["유형","예시 질의","대응 콘텐츠"], rows:[[...]×4]}, strategy:{type:"flow", steps:[5단계]}, measure:{head:["지표","방법","도구"], rows}, log:[{date:"2026.10", text:"계획 수립"}] }`
- 화면: Panel 헤더 줄(상태 배지 · 오픈 · 분야 · 지역, null은 "—") → 왜 GEO인가 → 타깃 질의 표(제목에 "예시") → 실행 전략 `<Visual visual={geo.strategy}/>` → 측정 계획 표 → 진행 로그. 표는 `<Visual visual={{type:"table",...}}/>` 재사용(좁으면 카드)
- 문구 제약: 수치 · 성과 표현 금지, "가설" · "계획"으로 서술

- [ ] **Step 1:** check-data에 `geo.status.label === "준비 중"`, `geo.log.length >= 1` assert, FAIL 확인
- [ ] **Step 2:** 데이터 · GeoLab 구현 → `npm run check` PASS, `npm run build`
- [ ] **Step 3:** 데스크톱 · 375px · 다크, 휠로 끝까지 내린 뒤에만 경력으로 넘어감(Review Focus 5)
- [ ] **Step 4:** 커밋 `feat: GEO lab plan for a labor law office site`, push

### Task 6: 경력

**Files:**
- Modify: `components/sections/Career.jsx`, `data/portfolio.json`(`career` gained 문구), `data/career-docs.json`

**Interfaces:**
- 하단에 원본 Overview의 학력 · 교육 / 수상(DeckLink) / 해외 활동 Panel 3개를 그대로 옮김(`data.education` · `awards` · `activities`)
- career-docs: 그라운드케이는 "광고 · SEO 기획 및 운영"을 duties 첫 번째로, SaaS 기획 duty는 summary 한 줄만. 모비데이즈 항목 추가 `{company:"모비데이즈", dept:"퍼포먼스 마케터 (인턴)", period:"2020.11 - 2021.03", overview:"롯데홈쇼핑 · 외교부 · 국기원 · 한국장학재단 캠페인 광고 운영에 참여했습니다.", duties:[]}`(duties 빈 배열에서 모달이 깨지지 않는지 확인). 뉴엔AI는 뉴스 85만 건 AI 분석 · 시장 모니터링 각도만 남김, 셀메이트는 overview 한 줄
- `career[].gained` 문구도 같은 방향으로 수정, 직군(field) 값은 그대로

- [ ] **Step 1:** 데이터 수정, 모비데이즈 상세 열어 빈 duties 렌더 확인
- [ ] **Step 2:** 하단 패널 3개 이동, 데스크톱 · 375px · 다크, 수상 발표 자료 모달 열림(`open_award`)
- [ ] **Step 3:** `npm run check && npm run build`, 커밋 `feat: marketing-first career and education panels`, push

### Task 7: 문의 · 메타 · 정리

**Files:**
- Modify: `app/api/contact/route.js`(subject `[마케팅 포트폴리오 문의] ${company}`), `app/layout.js`(metadata), `README.md`
- Delete: 쓰이지 않는 `public/projects/*`(PM 케이스 이미지), `next.svg` 등 기본 자산 중 미참조 파일

**Interfaces:**
- metadata: `title:"조병윤 · Growth Marketing Portfolio"`, `description:"검색 유입 진단 · 측정 설계 · 구현까지 하는 그로스 마케터 포트폴리오"`, `openGraph` 같은 값
- 이 사이트에 llms.txt · JSON-LD 넣지 않음

- [ ] **Step 1:** 수정 후 `grep -r "projects/" app components data` 로 삭제 대상 미참조 확인
- [ ] **Step 2:** 한국어 전체 교정(`data/*.json`, 화면 문구): 띄어쓰기, " · ", PM 표현("서비스 기획자") 잔존 여부 `grep -rn "기획자\|PM" data components app`
- [ ] **Step 3:** `npm run lint && npm run check && npm run build`, 문의 폼은 RESEND_API_KEY 없으므로 502 → 오류 문구 표시 확인
- [ ] **Step 4:** 커밋 `chore: contact subject, metadata, cleanup`, push

### Task 8: 배포 안내(코드 없음)

- [ ] 사용자에게 안내: vercel.com/new → Import Git Repository → `choby-pm/portfolio-mkt` Import → Framework Next.js 확인 → Environment Variables에 `RESEND_API_KEY` → Deploy. GA4: analytics.google.com → 관리 → 속성 만들기 → 웹 스트림(배포 URL) → 측정 ID를 알려 주면 `lib/gtag.js`에 넣고 커밋. 받을 수치 목록(spec "받을 수치") 함께 질문
