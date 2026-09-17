"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import { formatarPreco } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

type CatalogoFiltravelProps = {
  produtos: Produto[];
  categoriaInicial?: string;
  buscaInicial?: string;
};

export function CatalogoFiltravel({ produtos, categoriaInicial, buscaInicial }: CatalogoFiltravelProps) {
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const categorias = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria))),
    [produtos],
  );
  const [categoriasAtivas, setCategoriasAtivas] = useState<Set<string>>(
    () => new Set(categoriaInicial && categorias.includes(categoriaInicial) ? [categoriaInicial] : []),
  );
  const [busca, setBusca] = useState(buscaInicial ?? "");

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

  const filtrosAtivos = categoriasAtivas.size > 0 || precoMax < precoMaxCatalogo || busca.trim() !== "";

  function limparFiltros() {
    setCategoriasAtivas(new Set());
    setPrecoMax(precoMaxCatalogo);
    setBusca("");
  }

  const buscaNormalizada = busca.trim().toLowerCase();
  const filtrados = produtos.filter(
    (p) =>
      (categoriasAtivas.size === 0 || categoriasAtivas.has(p.categoria)) &&
      p.precoBase <= precoMax &&
      (buscaNormalizada === "" || p.nome.toLowerCase().includes(buscaNormalizada)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 mb-[42px] pb-[24px] border-b border-black/10">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar quadros..."
            className="flex-1 min-w-[200px] max-w-[320px] border-b border-black/20 py-2 text-[15px] bg-transparent outline-none"
          />

          <div className="flex items-center gap-3 text-[14px] text-black/60 ml-auto">
            <span>Até {formatarPreco(precoMax)}</span>
            <input
              type="range"
              min={precoMinCatalogo}
              max={precoMaxCatalogo}
              value={precoMax}
              onChange={(e) => setPrecoMax(Number(e.target.value))}
              className="w-[140px] md:w-[180px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => alternarCategoria(categoria)}
              className={`px-4 py-2 text-[14px] rounded-[6px] transition-colors ${
                categoriasAtivas.has(categoria)
                  ? "bg-black text-white"
                  : "border border-black/20 text-black/70 hover:border-black/40"
              }`}
            >
              {categoria}
            </button>
          ))}

          {filtrosAtivos && (
            <button type="button" onClick={limparFiltros} className="text-[14px] underline ml-auto">
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[32px] justify-items-center">
        {filtrados.map((produto) => (
          <ProductCard key={produto.id} produto={produto} onQuickView={setProdutoQuickView} />
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className="text-[18px] text-black/50">Nenhum quadro encontrado com esses filtros.</p>
      )}

      <div className="flex justify-end mt-[42px]">
        <a href="#topo" className="text-[16px] underline">
          Voltar ao topo
        </a>
      </div>

      <QuickViewDrawer produto={produtoQuickView} onClose={() => setProdutoQuickView(null)} />
    </div>
  );
}
