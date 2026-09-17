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
    <div className="flex flex-col md:flex-row gap-[42px]">
      <aside className="w-full md:w-[220px] shrink-0">
        <label className="flex flex-col gap-1 mb-[32px]">
          <span className="text-[16px] tracking-artu border-b border-black pb-2">Buscar</span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Nome do quadro..."
            className="border border-black/20 px-3 py-2 text-[15px] bg-transparent mt-2"
          />
        </label>

        <p className="text-[16px] tracking-artu border-b border-black pb-2 mb-[17px]">Categoria</p>
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

        <p className="text-[16px] tracking-artu border-b border-black pb-2 mb-[17px]">Preço</p>
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
            Limpar filtros
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
          <a href="#topo" className="text-[16px] underline">
            Voltar ao topo
          </a>
        </div>
      </div>

      <QuickViewDrawer produto={produtoQuickView} onClose={() => setProdutoQuickView(null)} />
    </div>
  );
}
