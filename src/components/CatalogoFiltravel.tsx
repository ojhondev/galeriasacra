"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import { formatarPreco } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

export function CatalogoFiltravel({ produtos }: { produtos: Produto[] }) {
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const categorias = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria))),
    [produtos],
  );
  const [categoriasAtivas, setCategoriasAtivas] = useState<Set<string>>(new Set());

  const precoMinCatalogo = useMemo(
    () => Math.min(...produtos.map((p) => p.precoBase)),
    [produtos],
  );
  const precoMaxCatalogo = useMemo(
    () => Math.max(...produtos.map((p) => p.precoBase)),
    [produtos],
  );
  const [precoMax, setPrecoMax] = useState(precoMaxCatalogo);

  function alternarCategoria(categoria: string) {
    setCategoriasAtivas((prev) => {
      const next = new Set(prev);
      if (next.has(categoria)) next.delete(categoria);
      else next.add(categoria);
      return next;
    });
  }

  const filtrosAtivos = categoriasAtivas.size > 0 || precoMax < precoMaxCatalogo;

  function limparFiltros() {
    setCategoriasAtivas(new Set());
    setPrecoMax(precoMaxCatalogo);
  }

  const filtrados = produtos.filter(
    (p) =>
      (categoriasAtivas.size === 0 || categoriasAtivas.has(p.categoria)) &&
      p.precoBase <= precoMax,
  );

  return (
    <div className="flex flex-col md:flex-row gap-[42px]">
      <aside className="w-full md:w-[220px] shrink-0">
        <p className="text-[16px] tracking-artu border-b border-black pb-2 mb-[17px]">CATEGORIA</p>
        <div className="flex flex-col gap-2 mb-[32px]">
          {categorias.map((categoria) => (
            <label key={categoria} className="flex items-center gap-2 text-[16px] cursor-pointer">
              <input
                type="checkbox"
                checked={categoriasAtivas.has(categoria)}
                onChange={() => alternarCategoria(categoria)}
              />
              {categoria}
            </label>
          ))}
        </div>

        <p className="text-[16px] tracking-artu border-b border-black pb-2 mb-[17px]">PREÇO</p>
        <input
          type="range"
          min={precoMinCatalogo}
          max={precoMaxCatalogo}
          value={precoMax}
          onChange={(e) => setPrecoMax(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-[14px] text-black/60 mt-2">Até {formatarPreco(precoMax)}</p>

        {filtrosAtivos && (
          <button type="button" onClick={limparFiltros} className="text-[14px] underline mt-[17px]">
            LIMPAR FILTROS
          </button>
        )}
      </aside>

      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-[32px]">
          {filtrados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} onQuickView={setProdutoQuickView} />
          ))}
        </div>

        {filtrados.length === 0 && (
          <p className="text-[18px] text-black/50">Nenhum quadro encontrado com esses filtros.</p>
        )}

        <div className="flex justify-end mt-[42px]">
          <a href="#topo" className="text-[18px] tracking-artu underline">
            VOLTAR AO TOPO
          </a>
        </div>
      </div>

      <QuickViewDrawer produto={produtoQuickView} onClose={() => setProdutoQuickView(null)} />
    </div>
  );
}
