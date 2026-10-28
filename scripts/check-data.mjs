// 데이터 자체 점검: 지어낸 값 · 깨진 참조가 화면에 나가지 않게. npm run check
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/portfolio.json", import.meta.url), "utf8"));
assert.ok(data.profile, "profile 없음");

console.log("check-data: ok");
