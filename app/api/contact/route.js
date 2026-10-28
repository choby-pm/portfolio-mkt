import data from "@/data/portfolio.json";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 문의 폼 → Resend로 본인 메일에 발송. 회신은 방문자 메일로 바로 가도록 reply_to 지정
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const company = String(body?.company ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  // 숨긴 필드가 채워졌으면 봇: 성공처럼 응답하고 보내지 않음
  if (body?.website) return Response.json({ ok: true });
  if (!company || company.length > 50 || !EMAIL.test(email) || email.length > 100 || !message || message.length > 5000) {
    return Response.json({ ok: false, error: "입력값을 확인해 주세요." }, { status: 400 });
  }

  // shortcut: 도메인 미인증이라 Resend 기본 발신 주소 사용, 도메인 인증 후 내 도메인 주소로 교체
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: data.profile.email,
      reply_to: email,
      subject: `[마케팅 포트폴리오 문의] ${company}`,
      text: `${message}\n\n---\n회사: ${company}\n회신 메일: ${email}`,
    }),
  });
  if (!res.ok) {
    console.error("resend failed", res.status, await res.text());
    return Response.json({ ok: false, error: "메일을 보내지 못했습니다." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
