"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useArrastarScroll } from "@/lib/useArrastarScroll";
import type { Colecao } from "@/lib/colecoes";

export function CircularCategories({ colecoes }: { colecoes: Colecao[] }) {
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

      {colecoes.map((colecao) => (
        <Link
          key={colecao.id}
          href={`/quadros?categoria=${encodeURIComponent(colecao.nome)}`}
          onClickCapture={bloquearCliqueSeArrastou}
          draggable={false}
          className="flex flex-col items-center gap-2 shrink-0 w-[80px] md:w-[92px]"
        >
          <span className="relative w-[64px] h-[64px] md:w-[76px] md:h-[76px] rounded-full overflow-hidden shrink-0 bg-[#f2f2ef] mx-auto">
            <Image src={colecao.imagemUrl} alt={colecao.nome} fill className="object-cover" />
          </span>
          <span className="text-[12px] leading-tight text-black/70 text-center">{colecao.nome}</span>
        </Link>
      ))}
    </div>
  );
}
