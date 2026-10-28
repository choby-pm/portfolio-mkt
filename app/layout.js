import localFont from "next/font/local";
import Script from "next/script";
import { GA_ID, noTrackScript } from "@/lib/gtag";
import VercelAnalytics from "@/components/VercelAnalytics";
import "./globals.css";

// Pretendard (OFL 1.1, github.com/orioncactus/pretendard)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
});

const title = "조병윤 · Growth Marketing Portfolio";
const description = "검색 유입 진단 · 측정 설계 · 구현까지 하는 그로스 마케터 포트폴리오";
export const metadata = { title, description, openGraph: { title, description, type: "website", locale: "ko_KR" } };

// 하이드레이션 전에 테마를 정해 깜빡임 방지. 기본은 라이트, 사용자가 토글로 고른 값이 있으면 그 값. localStorage 접근은 프라이빗 모드에서 throw 가능
const themeScript = `try{var t=localStorage.getItem("theme")}catch(e){}document.documentElement.dataset.theme=t||"light"`;

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${pretendard.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* dev에서 "script tag while rendering" 경고가 뜨지만 SSR HTML에서 동기 실행되므로 무해. next/script는 런타임 큐로 지연돼 깜빡임 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: noTrackScript }} />
      </head>
      <body className="font-sans">
        {children}
        <VercelAnalytics />
        {/* GA4: 개발 중 접속이 통계에 섞이지 않게 운영 빌드에서만. 하이드레이션 후 로드 */}
        {process.env.NODE_ENV === "production" && GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}");`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
