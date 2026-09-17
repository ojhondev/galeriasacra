"use client";

import { useState } from "react";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

type ProdutoGaleriaProps = {
  produto: Produto;
  molduraColor: string | null;
};

export function ProdutoGaleria({ produto, molduraColor }: ProdutoGaleriaProps) {
  const [imagemIndex, setImagemIndex] = useState(0);

  return (
    <div className="relative bg-[#f2f2ef] p-[8%]">
      <ArtPlate
        hue={produto.hue}
        orientacao={produto.orientacao}
        molduraColor={molduraColor}
        inverso={imagemIndex === 1}
      />

      <button
        type="button"
        aria-label="Imagem anterior"
        onClick={() => setImagemIndex((i) => (i === 0 ? 1 : 0))}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[18px] shadow"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próxima imagem"
        onClick={() => setImagemIndex((i) => (i === 0 ? 1 : 0))}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[18px] shadow"
      >
        ›
      </button>
    </div>
  );
}
