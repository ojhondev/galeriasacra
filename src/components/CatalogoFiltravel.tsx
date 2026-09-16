"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Produto } from "@/lib/products";

export function CatalogoFiltravel({ produtos }: { produtos: Produto[] }) {
  const categorias = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria))),
    [produtos],
  );
  const [filtro, setFiltro] = useState<string | null>(null);

  const filtrados = filtro ? produtos.filter((p) => p.categoria === filtro) : produtos;

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-[18px] tracking-artu mb-[32px]">
        <button
          type="button"
          onClick={() => setFiltro(null)}
          className={`pb-1 ${filtro === null ? "border-b border-black" : "text-black/50"}`}
        >
          TODOS
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            onClick={() => setFiltro(categoria)}
            className={`pb-1 ${filtro === categoria ? "border-b border-black" : "text-black/50"}`}
          >
            {categoria.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {filtrados.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>

      <div className="flex justify-end mt-[42px]">
        <a href="#topo" className="text-[18px] tracking-artu underline">
          VOLTAR AO TOPO
        </a>
      </div>
    </div>
  );
}
