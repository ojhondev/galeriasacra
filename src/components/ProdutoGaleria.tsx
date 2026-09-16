"use client";

import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

type ProdutoGaleriaProps = {
  produto: Produto;
  molduraColor: string | null;
  prevSlug: string;
  nextSlug: string;
};

export function ProdutoGaleria({ produto, molduraColor, prevSlug, nextSlug }: ProdutoGaleriaProps) {
  const router = useRouter();

  return (
    <div className="relative bg-[#f2f2ef] p-[8%]">
      <ArtPlate hue={produto.hue} orientacao={produto.orientacao} molduraColor={molduraColor} />

      <button
        type="button"
        aria-label="Obra anterior"
        onClick={() => router.push(`/quadros/${prevSlug}`)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[18px] shadow"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próxima obra"
        onClick={() => router.push(`/quadros/${nextSlug}`)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[18px] shadow"
      >
        ›
      </button>
    </div>
  );
}
