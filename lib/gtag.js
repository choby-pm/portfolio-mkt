// GA4 측정 ID(공개값). 새 속성 ID를 받으면 입력, 비어 있으면 GA 미로드: PM 포트폴리오와 통계가 섞이지 않게
export const GA_ID = "";

// 본인 방문 제외: 브라우저마다 한 번 ?notrack으로 접속하면 이 값이 저장되어 GA · Vercel Analytics 모두 기록하지 않음. ?track으로 해제
export const NO_TRACK_KEY = "notrack";

// <head>에서 GA보다 먼저 실행: 주소의 ?notrack / ?track을 저장하고, 표시가 있으면 GA 공식 수집 거부 플래그를 켬
export const noTrackScript = `try{var q=new URLSearchParams(location.search),k="${NO_TRACK_KEY}";if(q.has("notrack"))localStorage.setItem(k,"1");if(q.has("track"))localStorage.removeItem(k);if(localStorage.getItem(k))window["ga-disable-${GA_ID}"]=true}catch(e){}`;

// GA4 이벤트. 개발 환경(스크립트 미로드)이거나 차단 확장 프로그램이 있으면 조용히 무시
export const track = (name, params) => window.gtag?.("event", name, params);
