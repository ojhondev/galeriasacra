"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconChevronRight } from "@/components/icons";
import type { Produto } from "@/lib/products";

export function CategoriaCarousel({ produtos }: { produtos: Produto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categorias = Array.from(new Set(produtos.map((p) => p.categoria))).map((categoria) => {
    const representante = produtos.find((p) => p.categoria === categoria)!;
    return { categoria, hue: representante.hue };
  });

  function rolar(direcao: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direcao * 360, behavior: "smooth" });
  }

  return (
    <section className="px-4 md:px-8 py-[64px]">
      <div className="flex items-center justify-between mb-[24px]">
        <p className="text-[13px] tracking-artu text-black/50">Compre por Categoria</p>
        <div className="flex items-center gap-4">
          <Link href="/quadros" className="text-[14px] underline">
            Ver tudo →
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => rolar(-1)}
              aria-label="Rolar para a esquerda"
              className="w-9 h-9 border border-black/20 rounded-[6px] flex items-center justify-center"
            >
              <IconChevronRight className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => rolar(1)}
              aria-label="Rolar para a direita"
              className="w-9 h-9 border border-black/20 rounded-[6px] flex items-center justify-center"
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
        {categorias.map(({ categoria, hue }) => (
          <Link
            key={categoria}
            href={`/quadros?categoria=${encodeURIComponent(categoria)}`}
            className="relative block shrink-0 w-[300px] md:w-[420px] aspect-[3/4] snap-start"
          >
            <ArtPlate hue={hue} fill className="w-full h-full" />
            <div className="absolute inset-0 bg-black/20" />
            <p className="absolute bottom-5 left-5 text-white text-[24px] md:text-[28px] font-medium">
              {categoria}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
