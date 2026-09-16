"use client";

import { useEffect, useRef, useState } from "react";

export function VideoParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [deslocamento, setDeslocamento] = useState(0);

  useEffect(() => {
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;

    function aoRolar() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const percursoTotal = window.innerHeight + rect.height;
      const progresso = Math.min(Math.max((window.innerHeight - rect.top) / percursoTotal, 0), 1);
      const deslocamentoMax = rect.height * 0.15;
      setDeslocamento((progresso - 0.5) * 2 * deslocamentoMax);
    }

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[70vh] overflow-hidden">
      <video
        className="absolute left-0 -top-[15%] w-full h-[130%] object-cover"
        style={{ transform: `translateY(${deslocamento}px)` }}
        src="/videos/sacra-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  );
}
