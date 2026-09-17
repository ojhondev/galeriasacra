"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CATEGORIAS, IMAGENS_CATEGORIA } from "@/lib/category-images";
import { useArrastarScroll } from "@/lib/useArrastarScroll";

export function CircularCategories() {
  const { ref, handlers, bloquearCliqueSeArrastou } = useArrastarScroll<HTMLDivElement>();
  const pathname = usePathname();
  const naPaginaDeProduto = /^\/quadros\/.+/.test(pathname);

  if (naPaginaDeProduto) return null;

  return (
    <div
      ref={ref}
      {...handlers}
      className="flex items-start gap-6 md:gap-8 overflow-x-auto px-4 md:px-8 py-4 border-t border-black/10 select-none cursor-grab active:cursor-grabbing scrollbar-hide"
    >
      <Link
        href="/quadros"
        onClickCapture={bloquearCliqueSeArrastou}
        draggable={false}
        className="flex flex-col items-center gap-2 shrink-0 w-[80px] md:w-[92px]"
      >
        <span
          className="w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center text-white text-[13px] tracking-artu shrink-0"
          style={{ background: "var(--color-brand)" }}
        >
          Ofertas
        </span>
        <span className="text-[12px] leading-tight text-black/70 text-center">Em Oferta</span>
      </Link>

      {CATEGORIAS.map((categoria) => (
        <Link
          key={categoria}
          href={`/quadros?categoria=${encodeURIComponent(categoria)}`}
          onClickCapture={bloquearCliqueSeArrastou}
          draggable={false}
          className="flex flex-col items-center gap-2 shrink-0 w-[80px] md:w-[92px]"
        >
          <span className="relative w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden shrink-0 bg-[#f2f2ef] mx-auto">
            <Image src={IMAGENS_CATEGORIA[categoria]} alt={categoria} fill className="object-cover" />
          </span>
          <span className="text-[12px] leading-tight text-black/70 text-center">{categoria}</span>
        </Link>
      ))}
    </div>
  );
}
