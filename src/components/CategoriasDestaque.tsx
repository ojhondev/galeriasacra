"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconChevronRight } from "@/components/icons";
import type { Produto } from "@/lib/products";
import type { Colecao } from "@/lib/colecoes";

const IMAGEM_PADRAO = "/categorias/teste-generico.jpg";

export function CategoriasDestaque({ produtos, colecoes }: { produtos: Produto[]; colecoes: Colecao[] }) {
  const categorias = useMemo(() => Array.from(new Set(produtos.map((p) => p.categoria))), [produtos]);
  const [ativa, setAtiva] = useState(categorias[0]);
  const imagemPorCategoria = useMemo(
    () => new Map(colecoes.map((c) => [c.nome, c.imagemUrl])),
    [colecoes],
  );

  if (!ativa) return null;

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

      <Link href={`/quadros?categoria=${encodeURIComponent(ativa)}`} className="block group relative">
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <Image
            src={imagemPorCategoria.get(ativa) ?? IMAGEM_PADRAO}
            alt={ativa}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 flex items-end justify-between p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-white/95 px-3 py-1.5 text-[13px] tracking-artu">{ativa}</span>
          <span className="bg-white w-10 h-10 flex items-center justify-center rounded-[6px] shrink-0">
            <IconChevronRight />
          </span>
        </div>
      </Link>
    </section>
  );
}
