// 데이터 자체 점검: 지어낸 값 · 깨진 참조가 화면에 나가지 않게. npm run check
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/portfolio.json", import.meta.url), "utf8"));
assert.ok(data.profile, "profile 없음");

// 지표 값은 문자열 또는 null(수치 확인 중). 빈 문자열은 화면에 빈칸으로 나가므로 금지
const metricOk = (m) => m.value === null || (typeof m.value === "string" && m.value.trim() !== "");

assert.deepEqual(data.campaigns.map((c) => c.id), ["groundk-seo", "samsung-seo", "measurement"]);
for (const c of data.campaigns) {
  for (const m of c.metrics) assert.ok(metricOk(m), `${c.id} 지표 값: ${JSON.stringify(m)}`);
}

// 개요: KPI 값 규칙은 지표와 같고, 역량 근거는 실제 캠페인 id 또는 화면 id만
const ids = new Set(data.campaigns.map((c) => c.id));
assert.ok(data.kpis.length > 0, "kpis 없음");
for (const k of data.kpis) assert.ok(metricOk(k), `KPI 값: ${JSON.stringify(k)}`);
for (const c of data.capabilities) {
  if (c.proof?.case) assert.ok(ids.has(c.proof.case), `없는 케이스 근거: ${c.proof.case}`);
  if (c.proof?.screen) assert.ok(["geo"].includes(c.proof.screen), `없는 화면 근거: ${c.proof.screen}`);
}

console.log("check-data: ok");
