"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, SquareArrowOutUpRight } from "lucide-react";
import { track } from "@/lib/gtag";

// 수상 자료(발표 장표 · 포스터)를 보는 모달. <dialog>의 showModal로 딤드 · 포커스 가두기 · Esc 닫기를 브라우저에 맡김
// deck: { title, path + slides(장표 01.webp~) 또는 images[], size?: [w, h], note?: { headline, body } }
export default function DeckModal({ deck, open, onClose }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const images = deck.images ?? Array.from({ length: deck.slides }, (_, k) => `${deck.path}${String(k + 1).padStart(2, "0")}.webp`);
  const n = images.length;
  const [w, h] = deck.size ?? [1600, 900];
  const note = deck.note;

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) {
      setI(0);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  const go = (dir) => setI((k) => Math.min(n - 1, Math.max(0, k + dir)));

  // 휠로 장표 넘기기: 뒤 화면이 스크롤되지 않게 막고(passive: false), 트랙패드 관성으로 여러 장 넘어가지 않게 한 제스처에 한 장
  useEffect(() => {
    const d = ref.current;
    let lastStep = 0, lastWheel = 0;
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      // 새 제스처(직전 휠과 150ms 이상 간격)면 바로 넘기고, 관성으로 이어지는 휠은 1.2초 동안 무시
      const fresh = now - lastWheel > 150;
      lastWheel = now;
      if (Math.abs(e.deltaY) < 4 || now - lastStep < 350 || (!fresh && now - lastStep < 1200)) return;
      lastStep = now;
      go(Math.sign(e.deltaY));
    };
    d.addEventListener("wheel", onWheel, { passive: false });
    return () => d.removeEventListener("wheel", onWheel);
  }, [n]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // 딤드 영역(dialog 자신) 클릭 시 닫기. 안쪽 콘텐츠 클릭은 target이 자식이라 해당 없음
      onClick={(e) => e.target === ref.current && onClose()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      aria-label={deck.title}
      // 열 때 살짝 확대되며 나타남(@starting-style). 움직임 줄이기 설정이면 전환 없음
      className={`m-auto ${note ? "w-[min(92vw,56rem)]" : "w-[min(92vw,72rem)]"} max-h-[92vh] bg-transparent p-0 text-text backdrop:bg-black/70 opacity-0 scale-[0.98] open:opacity-100 open:scale-100 starting:open:opacity-0 starting:open:scale-[0.98] transition-[opacity,scale,display,overlay] transition-discrete duration-200 ease-out motion-reduce:transition-none`}
    >
      <div className="card overflow-hidden flex flex-col">
        {/* 패널과 같은 제목 줄 */}
        <div className="flex items-center justify-between gap-3 pl-4 pr-2 h-12 border-b border-border bg-surface-2">
          <p className="font-semibold truncate">{deck.title}</p>
          <button onClick={onClose} aria-label="닫기" className="size-9 grid place-items-center shrink-0 rounded-sm text-muted hover:text-text hover:bg-surface">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="p-3 md:p-4 flex flex-col gap-3">
        <div className={note ? "grid md:grid-cols-[auto_1fr] gap-5 md:gap-7 items-center" : ""}>
          {n > 1 ? (
            // 장표를 모두 겹쳐 두고 투명도로 교차 전환: 넘길 때 새 이미지를 만들지 않아 빈 화면이 깜빡이지 않음
            // 폭은 화면 높이 72vh에 맞춘 비율 폭과 패널 폭 중 작은 쪽
            <div className="relative mx-auto overflow-hidden rounded-sm bg-black" style={{ aspectRatio: `${w} / ${h}`, width: `min(100%, calc(72vh * ${w / h}))` }}>
              {images.map((src, k) => (
                <Image
                  key={src}
                  src={src}
                  alt={k === i ? `${deck.title} ${i + 1}번째 장표` : ""}
                  aria-hidden={k !== i}
                  fill
                  sizes="(min-width: 1280px) 72rem, 92vw"
                  priority={k === 0}
                  className={`object-contain transition-opacity duration-300 ease-out motion-reduce:transition-none ${k === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
          ) : (
            <Image
              src={images[0]}
              alt={deck.title}
              width={w}
              height={h}
              sizes="(min-width: 1280px) 72rem, 92vw"
              priority
              className="mx-auto w-auto h-auto max-w-full max-h-[72vh] object-contain rounded-sm bg-black"
            />
          )}
          {note && (
            <div className="px-1 pb-2">
              <p className="font-heading text-lg md:text-xl font-bold leading-snug">{note.headline}</p>
              <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-muted whitespace-pre-line">{note.body}</p>
            </div>
          )}
        </div>
        {n > 1 && <div className="flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} disabled={i === 0} aria-label="이전 장표" className="clay size-10 grid place-items-center disabled:opacity-40">
            <ChevronLeft size={20} aria-hidden />
          </button>
          <span className="text-sm tabular-nums text-muted w-16 text-center" aria-live="polite">{i + 1} / {n}</span>
          <button onClick={() => go(1)} disabled={i === n - 1} aria-label="다음 장표" className="clay size-10 grid place-items-center disabled:opacity-40">
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>}
        </div>
      </div>
    </dialog>
  );
}

// 이름을 누르면 모달이 열림. 아이콘으로 열 수 있는 항목임을 표시
export function DeckLink({ deck, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => { setOpen(true); track("open_award", { award: deck.title }); }} className="inline-flex items-center gap-1 font-medium text-left hover:text-accent transition-colors">
        {children}
        <SquareArrowOutUpRight size={13} className="text-accent shrink-0" aria-label="자료 보기" />
      </button>
      <DeckModal deck={deck} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
