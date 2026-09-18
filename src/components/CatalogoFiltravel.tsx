"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import { IconClose, IconChevronRight, IconFilter } from "@/components/icons";
import { formatarPreco } from "@/lib/pricing";
import type { Produto, Orientacao } from "@/lib/products";

type CatalogoFiltravelProps = {
  produtos: Produto[];
  categoriaInicial?: string;
  buscaInicial?: string;
};

const ORIENTACAO_LABEL: Record<Orientacao, string> = {
  retrato: "Retrato",
  paisagem: "Paisagem",
  quadrado: "Quadrado",
};
const ORIENTACOES = Object.keys(ORIENTACAO_LABEL) as Orientacao[];

function SecaoFiltro({
  titulo,
  aberta,
  onToggle,
  children,
}: {
  titulo: string;
  aberta: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 py-[17px]">
      <button type="button" onClick={onToggle} className="flex items-center justify-between w-full text-[17px]">
        {titulo}
        <IconChevronRight className={`transition-transform ${aberta ? "rotate-90" : ""}`} />
      </button>
      {aberta && <div className="mt-[17px]">{children}</div>}
    </div>
  );
}

export function CatalogoFiltravel({ produtos, categoriaInicial, buscaInicial }: CatalogoFiltravelProps) {
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const [busca, setBusca] = useState(buscaInicial ?? "");

  const categorias = useMemo(() => Array.from(new Set(produtos.map((p) => p.categoria))), [produtos]);
  const contagemPorCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const p of produtos) mapa.set(p.categoria, (mapa.get(p.categoria) ?? 0) + 1);
    return mapa;
  }, [produtos]);

  const precoMinCatalogo = useMemo(() => Math.min(...produtos.map((p) => p.precoBase)), [produtos]);
  const precoMaxCatalogo = useMemo(() => Math.max(...produtos.map((p) => p.precoBase)), [produtos]);

  const [categoriasAtivas, setCategoriasAtivas] = useState<Set<string>>(
    () => new Set(categoriaInicial && categorias.includes(categoriaInicial) ? [categoriaInicial] : []),
  );
  const [orientacoesAtivas, setOrientacoesAtivas] = useState<Set<Orientacao>>(new Set());
  const [precoMin, setPrecoMin] = useState(precoMinCatalogo);
  const [precoMax, setPrecoMax] = useState(precoMaxCatalogo);
  const [apenasEmEstoque, setApenasEmEstoque] = useState(false);

  const [painelAberto, setPainelAberto] = useState(false);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [secaoAberta, setSecaoAberta] = useState({
    preco: true,
    categorias: true,
    orientacao: false,
    disponibilidade: false,
  });

  const [draftCategorias, setDraftCategorias] = useState<Set<string>>(categoriasAtivas);
  const [draftOrientacoes, setDraftOrientacoes] = useState<Set<Orientacao>>(orientacoesAtivas);
  const [draftPrecoMin, setDraftPrecoMin] = useState(precoMin);
  const [draftPrecoMax, setDraftPrecoMax] = useState(precoMax);
  const [draftEmEstoque, setDraftEmEstoque] = useState(apenasEmEstoque);

  function abrirPainel() {
    setDraftCategorias(new Set(categoriasAtivas));
    setDraftOrientacoes(new Set(orientacoesAtivas));
    setDraftPrecoMin(precoMin);
    setDraftPrecoMax(precoMax);
    setDraftEmEstoque(apenasEmEstoque);
    setPainelAberto(true);
  }

  function aplicarFiltros() {
    setCategoriasAtivas(draftCategorias);
    setOrientacoesAtivas(draftOrientacoes);
    setPrecoMin(draftPrecoMin);
    setPrecoMax(draftPrecoMax);
    setApenasEmEstoque(draftEmEstoque);
    setPainelAberto(false);
  }

  function limparDraft() {
    setDraftCategorias(new Set());
    setDraftOrientacoes(new Set());
    setDraftPrecoMin(precoMinCatalogo);
    setDraftPrecoMax(precoMaxCatalogo);
    setDraftEmEstoque(false);
  }

  function alternarDraftCategoria(categoria: string) {
    setDraftCategorias((prev) => {
      const next = new Set(prev);
      if (next.has(categoria)) next.delete(categoria);
      else next.add(categoria);
      return next;
    });
  }

  function alternarDraftOrientacao(orientacao: Orientacao) {
    setDraftOrientacoes((prev) => {
      const next = new Set(prev);
      if (next.has(orientacao)) next.delete(orientacao);
      else next.add(orientacao);
      return next;
    });
  }

  const filtrosAtivos =
    categoriasAtivas.size > 0 ||
    orientacoesAtivas.size > 0 ||
    apenasEmEstoque ||
    precoMin > precoMinCatalogo ||
    precoMax < precoMaxCatalogo ||
    busca.trim() !== "";

  const quantidadeFiltrosAtivos =
    categoriasAtivas.size +
    orientacoesAtivas.size +
    (apenasEmEstoque ? 1 : 0) +
    (precoMin > precoMinCatalogo || precoMax < precoMaxCatalogo ? 1 : 0);

  function limparTudo() {
    setCategoriasAtivas(new Set());
    setOrientacoesAtivas(new Set());
    setApenasEmEstoque(false);
    setPrecoMin(precoMinCatalogo);
    setPrecoMax(precoMaxCatalogo);
    setBusca("");
  }

  const buscaNormalizada = busca.trim().toLowerCase();
  const categoriasFiltradasBusca = categorias.filter((c) =>
    c.toLowerCase().includes(buscaCategoria.trim().toLowerCase()),
  );

  const filtrados = produtos.filter(
    (p) =>
      (categoriasAtivas.size === 0 || categoriasAtivas.has(p.categoria)) &&
      (orientacoesAtivas.size === 0 || orientacoesAtivas.has(p.orientacao)) &&
      (!apenasEmEstoque || p.estoque > 0) &&
      p.precoBase >= precoMin &&
      p.precoBase <= precoMax &&
      (buscaNormalizada === "" || p.nome.toLowerCase().includes(buscaNormalizada)),
  );

  const faixaTotal = precoMaxCatalogo - precoMinCatalogo || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-[32px] pb-[24px] border-b border-black/10">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar quadros..."
          className="flex-1 min-w-[200px] max-w-[320px] border-b border-black/20 py-2 text-[15px] bg-transparent outline-none"
        />

        <button
          type="button"
          onClick={abrirPainel}
          className="inline-flex items-center gap-2 border border-black/20 px-4 py-2 text-[14px] rounded-[6px] hover:border-black/40"
        >
          <IconFilter />
          Filtros
          {quantidadeFiltrosAtivos > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">
              {quantidadeFiltrosAtivos}
            </span>
          )}
        </button>

        {filtrosAtivos && (
          <button type="button" onClick={limparTudo} className="text-[14px] underline">
            Limpar filtros
          </button>
        )}
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

      <div
        className={`fixed inset-0 z-[60] ${painelAberto ? "" : "pointer-events-none"}`}
        aria-hidden={!painelAberto}
      >
        <div
          onClick={() => setPainelAberto(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            painelAberto ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white flex flex-col transition-transform duration-300 ${
            painelAberto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-[17px] border-b border-black/10 shrink-0">
            <button type="button" onClick={() => setPainelAberto(false)} aria-label="Fechar">
              <IconClose />
            </button>
            <p className="text-[18px]">Filtros</p>
            <button
              type="button"
              onClick={limparDraft}
              className="text-[14px] underline"
              style={{ color: "var(--color-brand)" }}
            >
              Limpar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6">
            <SecaoFiltro
              titulo="Faixa de preço"
              aberta={secaoAberta.preco}
              onToggle={() => setSecaoAberta((s) => ({ ...s, preco: !s.preco }))}
            >
              <p className="text-[14px] text-black/60 mb-3">
                {formatarPreco(draftPrecoMin)} — {formatarPreco(draftPrecoMax)}
              </p>
              <div className="relative h-[4px] bg-black/10 rounded-full mb-[24px] mx-[9px]">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    background: "var(--color-brand)",
                    left: `${((draftPrecoMin - precoMinCatalogo) / faixaTotal) * 100}%`,
                    right: `${100 - ((draftPrecoMax - precoMinCatalogo) / faixaTotal) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={precoMinCatalogo}
                  max={precoMaxCatalogo}
                  value={draftPrecoMin}
                  onChange={(e) => setDraftPrecoMin(Math.min(Number(e.target.value), draftPrecoMax))}
                  className="range-dual"
                />
                <input
                  type="range"
                  min={precoMinCatalogo}
                  max={precoMaxCatalogo}
                  value={draftPrecoMax}
                  onChange={(e) => setDraftPrecoMax(Math.max(Number(e.target.value), draftPrecoMin))}
                  className="range-dual"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex flex-col gap-1">
                  <span className="text-[12px] text-black/50">Mín.</span>
                  <input
                    type="number"
                    min={precoMinCatalogo}
                    max={draftPrecoMax}
                    value={draftPrecoMin}
                    onChange={(e) => setDraftPrecoMin(Math.min(Number(e.target.value), draftPrecoMax))}
                    className="border border-black/20 rounded-[6px] px-3 py-2 text-[14px] bg-transparent outline-none w-full"
                  />
                </label>
                <label className="flex-1 flex flex-col gap-1">
                  <span className="text-[12px] text-black/50">Máx.</span>
                  <input
                    type="number"
                    min={draftPrecoMin}
                    max={precoMaxCatalogo}
                    value={draftPrecoMax}
                    onChange={(e) => setDraftPrecoMax(Math.max(Number(e.target.value), draftPrecoMin))}
                    className="border border-black/20 rounded-[6px] px-3 py-2 text-[14px] bg-transparent outline-none w-full"
                  />
                </label>
              </div>
            </SecaoFiltro>

            <SecaoFiltro
              titulo="Categorias"
              aberta={secaoAberta.categorias}
              onToggle={() => setSecaoAberta((s) => ({ ...s, categorias: !s.categorias }))}
            >
              <input
                value={buscaCategoria}
                onChange={(e) => setBuscaCategoria(e.target.value)}
                placeholder="Buscar categoria..."
                className="w-full border border-black/20 rounded-[6px] px-3 py-2 text-[14px] bg-transparent outline-none mb-3"
              />
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                {categoriasFiltradasBusca.map((categoria) => (
                  <label
                    key={categoria}
                    className="flex items-center justify-between gap-2 text-[15px] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={draftCategorias.has(categoria)}
                        onChange={() => alternarDraftCategoria(categoria)}
                      />
                      {categoria}
                    </span>
                    <span className="text-[13px] text-black/40">{contagemPorCategoria.get(categoria) ?? 0}</span>
                  </label>
                ))}
                {categoriasFiltradasBusca.length === 0 && (
                  <p className="text-[13px] text-black/40">Nenhuma categoria encontrada.</p>
                )}
              </div>
            </SecaoFiltro>

            <SecaoFiltro
              titulo="Formato"
              aberta={secaoAberta.orientacao}
              onToggle={() => setSecaoAberta((s) => ({ ...s, orientacao: !s.orientacao }))}
            >
              <div className="flex flex-col gap-3">
                {ORIENTACOES.map((orientacao) => (
                  <label key={orientacao} className="flex items-center gap-2 text-[15px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftOrientacoes.has(orientacao)}
                      onChange={() => alternarDraftOrientacao(orientacao)}
                    />
                    {ORIENTACAO_LABEL[orientacao]}
                  </label>
                ))}
              </div>
            </SecaoFiltro>

            <SecaoFiltro
              titulo="Disponibilidade"
              aberta={secaoAberta.disponibilidade}
              onToggle={() => setSecaoAberta((s) => ({ ...s, disponibilidade: !s.disponibilidade }))}
            >
              <label className="flex items-center gap-2 text-[15px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftEmEstoque}
                  onChange={(e) => setDraftEmEstoque(e.target.checked)}
                />
                Somente em estoque
              </label>
            </SecaoFiltro>
          </div>

          <div className="px-4 md:px-6 py-[17px] border-t border-black/10 shrink-0">
            <button
              type="button"
              onClick={aplicarFiltros}
              className="w-full text-white px-6 py-4 text-[15px] rounded-[6px]"
              style={{ background: "var(--color-brand)" }}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      <QuickViewDrawer produto={produtoQuickView} onClose={() => setProdutoQuickView(null)} />
    </div>
  );
}
