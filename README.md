# 조병윤 · Growth Marketing Portfolio

GEO · 그로스 마케터 포트폴리오. Next.js 16 (App Router) · React 19 · Tailwind v4, Vercel 배포.

- 콘텐츠: `data/portfolio.json` · `data/career-docs.json`. 수치가 없는 지표는 `null`로 두면 "—" · "수치 확인 중"으로 표시
- 데이터 점검: `npm run check`
- 문의 폼: Vercel 환경 변수 `RESEND_API_KEY` 필요
- GA4: `lib/gtag.js`의 `GA_ID`를 채우면 운영 빌드에서 로드. 본인 방문 제외는 주소에 `?notrack` 한 번 (`?track`으로 해제)

```bash
npm install
npm run dev
```
