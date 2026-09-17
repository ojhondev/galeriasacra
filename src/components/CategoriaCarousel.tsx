"use client";

import Link from "next/link";
import Image from "next/image";
import { IconChevronRight } from "@/components/icons";
import { CATEGORIAS, IMAGENS_CATEGORIA } from "@/lib/category-images";
import { useArrastarScroll } from "@/lib/useArrastarScroll";

export function CategoriaCarousel() {
  const { ref, arrastando, handlers, bloquearCliqueSeArrastou, rolar } = useArrastarScroll<HTMLDivElement>();

  return (
    <section className="px-4 md:px-8 py-[64px]">
      <div className="flex items-center justify-between mb-[24px]">
        <p className="text-[13px] tracking-artu text-black/50">Compre por Categoria</p>
        <Link href="/quadros" className="text-[14px] underline flex items-center gap-1">
          Ver tudo <IconChevronRight />
        </Link>
      </div>

      <div className="relative">
        <div
          ref={ref}
          {...handlers}
          className={`flex gap-5 overflow-x-auto pb-2 select-none ${
            arrastando ? "cursor-grabbing scroll-auto" : "cursor-grab scroll-smooth snap-x snap-mandatory"
          }`}
        >
          {CATEGORIAS.map((categoria) => (
            <Link
              key={categoria}
              href={`/quadros?categoria=${encodeURIComponent(categoria)}`}
              onClickCapture={bloquearCliqueSeArrastou}
              draggable={false}
              className="group relative block shrink-0 w-[300px] md:w-[420px] aspect-[3/4] snap-start overflow-hidden"
            >
              <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={IMAGENS_CATEGORIA[categoria]}
                  alt={categoria}
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <p className="absolute bottom-5 left-5 text-white text-[24px] md:text-[28px] font-medium pointer-events-none">
                {categoria}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => rolar(400)}
          aria-label="Ver próxima categoria"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center"
        >
          <IconChevronRight />
        </button>
      </div>
    </section>
  );
}
