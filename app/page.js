import data from "@/data/portfolio.json";
import TopBar from "@/components/TopBar";
import PageEffects from "@/components/PageEffects";
import Section from "@/components/Section";
import Intro from "@/components/sections/Intro";
import Cases from "@/components/sections/Cases";
import Capabilities from "@/components/sections/Capabilities";
import GeoLab from "@/components/sections/GeoLab";
import { CareerList, Background } from "@/components/sections/CareerList";
import Contact from "@/components/sections/Contact";

// 한 페이지, 케이스 우선: 소개(포지셔닝 · 사실 · 연락처) → 케이스 → 역량 → GEO 랩 → 경력 → 학력 · 수상 → 문의
export default function Home() {
  return (
    <>
      <TopBar profile={data.profile} />
      <main className="mx-auto max-w-[1040px] px-4 md:px-8 pb-24">
        <Intro profile={data.profile} kpis={data.kpis} />
        <Section id="cases" title="케이스" lead="검색 유입과 측정을 맡았던 일 3건입니다. 왼쪽이 결과, 오른쪽이 맥락과 실행입니다.">
          <Cases campaigns={data.campaigns} />
        </Section>
        <Section id="capabilities" title="역량">
          <Capabilities capabilities={data.capabilities} skills={data.skills} />
        </Section>
        <Section id="geo" title="GEO 랩">
          <GeoLab geo={data.geo} />
        </Section>
        <Section id="career" title="경력" lead="회사명을 누르면 경력기술서가 열립니다.">
          <CareerList career={data.career} />
        </Section>
        <Section id="background" title="학력 · 수상 · 해외 활동">
          <Background education={data.education} awards={data.awards} activities={data.activities} />
        </Section>
        <Section id="contact" title="문의">
          <Contact profile={data.profile} />
        </Section>
      </main>
      <PageEffects />
    </>
  );
}
