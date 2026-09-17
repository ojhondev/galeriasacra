"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

const IMAGENS_CATEGORIA: Record<string, string> = {
  "Quadros Religiosos": "/categorias/quadros-religiosos.jpg",
};

export function CategoriasDestaque({ produtos }: { produtos: Produto[] }) {
  const categorias = useMemo(() => Array.from(new Set(produtos.map((p) => p.categoria))), [produtos]);
  const [ativa, setAtiva] = useState(categorias[0]);

  const produtoDestaque = produtos.find((p) => p.categoria === ativa) ?? produtos[0];

  if (!produtoDestaque) return null;

  return (
    <section className="px-4 md:px-8 py-[80px]">
      <p className="text-[13px] tracking-artu text-black/50 mb-[17px]">Destaques por Categoria</p>

      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-black/10 mb-[32px]">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setAtiva(categoria)}
            className={`pb-[17px] text-[clamp(18px,3vw,32px)] tracking-artu transition-colors ${
              ativa === categoria ? "text-black border-b-2 border-black -mb-px" : "text-black/30"
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      <Link href={`/quadros/${produtoDestaque.slug}`} className="block group relative">
        {IMAGENS_CATEGORIA[ativa] ? (
          <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
            <Image
              src={IMAGENS_CATEGORIA[ativa]}
              alt={ativa}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ) : (
          <ArtPlate
            hue={produtoDestaque.hue}
            fill
            hoverZoom
            className="w-full h-[50vh] md:h-[70vh]"
          />
        )}
        <div className="absolute inset-0 flex items-end justify-between p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-white/95 px-3 py-1.5 text-[13px] tracking-artu">
            {produtoDestaque.nome}
          </span>
          <span className="bg-white w-10 h-10 flex items-center justify-center text-[18px] rounded-[6px] shrink-0">
            →
          </span>
        </div>
      </Link>
    </section>
  );
}
