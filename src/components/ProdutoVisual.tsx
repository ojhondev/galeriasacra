"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

type ProdutoVisualProps = {
  produto: Produto;
  molduraColor: string | null;
  prevSlug: string;
  nextSlug: string;
};

export function ProdutoVisual({ produto, molduraColor, prevSlug, nextSlug }: ProdutoVisualProps) {
  const router = useRouter();
  const pinRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef({ dragging: false, lastX: 0 });

  useEffect(() => {
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;

    function aoRolar() {
      if (!pinRef.current || window.innerWidth < 1024) return;
      const rect = pinRef.current.getBoundingClientRect();
      const alcance = rect.height - window.innerHeight;
      if (alcance <= 0) return;
      const progresso = Math.min(Math.max(-rect.top, 0), alcance) / alcance;
      setRotation(progresso * 360);
    }

    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  function aoPressionar(e: PointerEvent) {
    dragRef.current = { dragging: true, lastX: e.clientX };
  }
  function aoMover(e: PointerEvent) {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    dragRef.current.lastX = e.clientX;
    setRotation((r) => r + dx * 0.6);
  }
  function aoSoltar() {
    dragRef.current.dragging = false;
  }

  return (
    <div ref={pinRef} className="lg:h-[220vh] relative border-b border-black lg:border-b-0">
      <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between px-4 md:px-8 pt-[17px] pb-[32px]">
        <div className="flex items-center gap-x-8 text-[20px]">
          <button
            type="button"
            aria-label="Obra anterior"
            onClick={() => router.push(`/quadros/${prevSlug}`)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Próxima obra"
            onClick={() => router.push(`/quadros/${nextSlug}`)}
          >
            →
          </button>
        </div>

        <div
          className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none py-[42px]"
          style={{ perspective: "1400px" }}
          onPointerDown={aoPressionar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerLeave={aoSoltar}
        >
          <div
            className="w-[70%] max-w-[420px]"
            style={{ transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}
          >
            <ArtPlate hue={produto.hue} orientacao={produto.orientacao} molduraColor={molduraColor} />
          </div>
        </div>

        <p className="text-center text-[14px] tracking-artu text-black/40">ARRASTE PARA GIRAR</p>
      </div>
    </div>
  );
}
