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

console.log("check-data: ok");
