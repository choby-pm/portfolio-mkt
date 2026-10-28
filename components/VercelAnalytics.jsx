"use client";

import { Analytics } from "@vercel/analytics/next";
import { NO_TRACK_KEY } from "@/lib/gtag";

// 본인 브라우저(?notrack으로 표시)에서는 Vercel Analytics 기록을 보내지 않음
const skipMine = (event) => {
  try {
    return localStorage.getItem(NO_TRACK_KEY) ? null : event;
  } catch {
    return event;
  }
};

export default function VercelAnalytics() {
  return <Analytics beforeSend={skipMine} />;
}
