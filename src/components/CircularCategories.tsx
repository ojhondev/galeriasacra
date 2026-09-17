"use client";

import Link from "next/link";
import Image from "next/image";
import { ArtPlate } from "@/components/ArtPlate";
import { IMAGENS_CATEGORIA } from "@/lib/category-images";
import { useArrastarScroll } from "@/lib/useArrastarScroll";
import type { Produto } from "@/lib/products";

export function CircularCategories({ produtos }: { produtos: Produto[] }) {
  const { ref, handlers, bloquearCliqueSeArrastou } = useArrastarScroll<HTMLDivElement>();

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria))).map((categoria) => {
    const representante = produtos.find((p) => p.categoria === categoria)!;
    return { categoria, hue: representante.hue };
  });

  return (
    <div
      ref={ref}
      {...handlers}
      className="flex items-start gap-6 md:gap-8 overflow-x-auto px-4 md:px-8 py-4 select-none cursor-grab active:cursor-grabbing scrollbar-hide"
    >
      <Link
        href="/quadros"
        onClickCapture={bloquearCliqueSeArrastou}
        draggable={false}
        className="flex flex-col items-center gap-2 shrink-0"
      >
        <span
          className="w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center text-white text-[13px] tracking-artu shrink-0"
          style={{ background: "var(--color-brand)" }}
        >
          Ofertas
        </span>
        <span className="text-[13px] text-black/70 whitespace-nowrap">Em Oferta</span>
      </Link>

      {categorias.map(({ categoria, hue }) => (
        <Link
          key={categoria}
          href={`/quadros?categoria=${encodeURIComponent(categoria)}`}
          onClickCapture={bloquearCliqueSeArrastou}
          draggable={false}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <span className="relative w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden shrink-0 bg-[#f2f2ef]">
            {IMAGENS_CATEGORIA[categoria] ? (
              <Image src={IMAGENS_CATEGORIA[categoria]} alt={categoria} fill className="object-cover" />
            ) : (
              <ArtPlate hue={hue} fill className="w-full h-full" />
            )}
          </span>
          <span className="text-[13px] text-black/70 whitespace-nowrap">{categoria}</span>
        </Link>
      ))}
    </div>
  );
}
