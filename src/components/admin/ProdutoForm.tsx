"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/lib/products";
import type { Colecao } from "@/lib/colecoes";

function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Cartao({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-col gap-4">
      {titulo && <p className="text-[16px] font-semibold">{titulo}</p>}
      {children}
    </div>
  );
}

function Campo({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] text-black/60">{label}</span>
      {children}
      {hint && <span className="text-[12px] text-black/40">{hint}</span>}
    </label>
  );
}

const inputCls =
  "border border-black/15 rounded-[6px] px-3 py-2.5 text-[15px] outline-none bg-transparent focus:border-black/40";

export function ProdutoForm({
  produto,
  colecoes,
  action,
}: {
  produto?: Produto;
  colecoes: Colecao[];
  action: (formData: FormData) => void;
}) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [slug, setSlug] = useState(produto?.slug ?? "");
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(Boolean(produto?.slug));
  const [hue, setHue] = useState(produto?.hue ?? 200);

  const corPreview = useMemo(() => `hsl(${hue} 55% 62%)`, [hue]);

  function handleNomeChange(valor: string) {
    setNome(valor);
    if (!slugEditadoManualmente) setSlug(gerarSlug(valor));
  }

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Cartao titulo="Detalhes do produto">
          <Campo label="Nome">
            <input
              name="nome"
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              required
              className={inputCls}
            />
          </Campo>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="SKU">
              <input name="sku" defaultValue={produto?.sku} required className={inputCls} />
            </Campo>
            <Campo label="Identificador da URL (slug)" hint={`/quadros/${slug || "..."}`}>
              <input
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEditadoManualmente(true);
                }}
                required
                pattern="[a-z0-9-]+"
                className={inputCls}
              />
            </Campo>
          </div>

          <Campo label="Descrição curta" hint="Usada na listagem e nos cards de produto.">
            <input name="descricaoCurta" defaultValue={produto?.descricaoCurta} required className={inputCls} />
          </Campo>

          <Campo label="Descrição longa" hint="Um parágrafo por linha — aparece na página do produto.">
            <textarea
              name="descricaoLonga"
              defaultValue={produto?.descricaoLonga.join("\n")}
              required
              rows={5}
              className={inputCls}
            />
          </Campo>
        </Cartao>

        <Cartao titulo="Aparência">
          <Campo label="Orientação">
            <select name="orientacao" defaultValue={produto?.orientacao ?? "retrato"} className={inputCls}>
              <option value="retrato">Retrato</option>
              <option value="paisagem">Paisagem</option>
              <option value="quadrado">Quadrado</option>
            </select>
          </Campo>

          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-[6px] shrink-0 border border-black/10"
              style={{ background: corPreview }}
            />
            <Campo label="Cor de identificação (0–360)" hint="Usada como placeholder até termos fotografia real da obra.">
              <input
                type="range"
                name="hue"
                min={0}
                max={360}
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full"
              />
            </Campo>
          </div>
        </Cartao>

        <Cartao titulo="Preço">
          <Campo label="Preço base (R$)">
            <input
              type="number"
              name="precoBase"
              defaultValue={produto?.precoBase}
              required
              min={0}
              className={inputCls}
            />
          </Campo>
        </Cartao>

        <Cartao titulo="Estoque e entrega">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Estoque (unidades físicas)">
              <input
                type="number"
                name="estoque"
                defaultValue={produto?.estoque ?? 10}
                required
                min={0}
                className={inputCls}
              />
            </Campo>
            <Campo label="Prazo de entrega estimado (dias úteis)" hint="Mostrado na Visualização Rápida.">
              <input
                type="number"
                name="prazoEntregaDias"
                defaultValue={produto?.prazoEntregaDias ?? 4}
                required
                min={1}
                className={inputCls}
              />
            </Campo>
          </div>
        </Cartao>

        <button
          type="submit"
          className="bg-black text-white px-8 py-4 text-[15px] rounded-[6px] self-start"
        >
          Salvar produto
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <Cartao titulo="Status">
          <select name="status" defaultValue={produto?.ativo ?? true ? "ativo" : "inativo"} className={inputCls}>
            <option value="ativo">Ativo (visível na loja)</option>
            <option value="inativo">Inativo (oculto na loja)</option>
          </select>
        </Cartao>

        <Cartao titulo="Organização do produto">
          <Campo label="Categoria" hint="Gerencie as opções em Coleções.">
            <select name="categoria" defaultValue={produto?.categoria ?? colecoes[0]?.nome} className={inputCls}>
              {colecoes.map((colecao) => (
                <option key={colecao.id} value={colecao.nome}>
                  {colecao.nome}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Ordem de exibição" hint="Menor aparece primeiro no catálogo.">
            <input
              type="number"
              name="ordem"
              defaultValue={produto?.ordem ?? 0}
              className={inputCls}
            />
          </Campo>
        </Cartao>
      </div>
    </form>
  );
}
