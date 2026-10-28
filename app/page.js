import data from "@/data/portfolio.json";
import TopBar from "@/components/TopBar";
import PageEffects from "@/components/PageEffects";
import KnowledgePanel from "@/components/KnowledgePanel";
import Section from "@/components/Section";
import Hero from "@/components/sections/Hero";
import Results from "@/components/sections/Results";
import Faq from "@/components/sections/Faq";
import GeoLab from "@/components/sections/GeoLab";
import { CareerList, Background } from "@/components/sections/CareerList";
import Contact from "@/components/sections/Contact";

// 한 페이지: 요약(+ 지식 패널) → 캠페인 → 질문 → GEO 랩 → 경력 → 학력 · 수상 → 문의
// 넓은 화면: 모든 섹션이 같은 왼쪽 열에 정렬되고, 지식 패널은 오른쪽 열에서 페이지 끝까지 따라옴. 좁은 화면: 요약 바로 아래
export default function Home() {
  const col = "lg:col-start-1";
  return (
    <>
      <TopBar profile={data.profile} />
      <main className="mx-auto max-w-[1120px] px-4 md:px-8 pb-24 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-14">
        <Hero answer={data.answer} />
        <aside aria-label="프로필" className="mt-8 lg:mt-16 lg:col-start-2 lg:row-start-1 lg:row-span-7 lg:self-start lg:sticky lg:top-24">
          <KnowledgePanel profile={data.profile} kpis={data.kpis} />
        </aside>
        <Section id="campaigns" title="캠페인" lead="검색 유입과 측정을 맡았던 일 3건입니다. 누르면 실행 흐름과 결과가 펼쳐집니다." className={col}>
          <Results campaigns={data.campaigns} />
        </Section>
        <Section id="faq" title="자주 묻는 질문" lead="채용 담당자가 물어볼 만한 질문에 답했습니다. 답마다 근거가 되는 일로 이어집니다." className={col}>
          <Faq capabilities={data.capabilities} skills={data.skills} />
        </Section>
        <Section id="geo" title="GEO 랩" className={col}>
          <GeoLab geo={data.geo} />
        </Section>
        <Section id="career" title="경력" lead="회사명을 누르면 경력기술서가 열립니다." className={col}>
          <CareerList career={data.career} />
        </Section>
        <Section id="background" title="학력 · 수상 · 해외 활동" className={col}>
          <Background education={data.education} awards={data.awards} activities={data.activities} />
        </Section>
        <Section id="contact" title="문의" className={col}>
          <Contact profile={data.profile} />
        </Section>
      </main>
      <PageEffects />
    </>
  );
}
