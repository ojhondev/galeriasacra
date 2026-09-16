"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArtPlate } from "@/components/ArtPlate";
import { ARPreview } from "@/components/ARPreview";
import { useCart } from "@/lib/cart";
import {
  MATERIAIS,
  MOLDURAS,
  TAMANHOS,
  calcularPreco,
  formatarPreco,
  type MaterialId,
  type MolduraId,
  type TamanhoId,
} from "@/lib/pricing";
import type { Produto, Orientacao } from "@/lib/products";

function aspectRatioDoTamanho(tamanhoId: TamanhoId, orientacao: Orientacao): number {
  if (orientacao === "quadrado") return 1;
  const [a, b] = tamanhoId.split("x").map(Number);
  const [largura, altura] = orientacao === "paisagem" ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
  return largura / altura;
}

type CustomizerProps = {
  produtoInicial?: Produto;
  produtos?: Produto[];
  permitirTrocarImagem?: boolean;
  ocultarImagem?: boolean;
  onMolduraChange?: (cor: string | null) => void;
  comprarFixoNoMobile?: boolean;
};

export function Customizer({
  produtoInicial,
  produtos = [],
  permitirTrocarImagem = false,
  ocultarImagem = false,
  onMolduraChange,
  comprarFixoNoMobile = false,
}: CustomizerProps) {
  const router = useRouter();
  const { adicionar } = useCart();

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | undefined>(produtoInicial);
  const [imagemPropria, setImagemPropria] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState<TamanhoId>("40x60");
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const [material, setMaterial] = useState<MaterialId>("tela-canvas");
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const precoBase = produtoSelecionado?.precoBase ?? 349;
  const nomeItem = imagemPropria
    ? "Quadro personalizado (imagem própria)"
    : produtoSelecionado?.nome ?? "Monte Seu Quadro";

  const preco = useMemo(
    () => calcularPreco(precoBase, tamanho, moldura, material),
    [precoBase, tamanho, moldura, material],
  );

  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const aspectRatio = aspectRatioDoTamanho(tamanho, produtoSelecionado?.orientacao ?? "retrato");

  useEffect(() => {
    onMolduraChange?.(molduraAtual?.cor ?? null);
  }, [molduraAtual, onMolduraChange]);

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setImagemPropria(URL.createObjectURL(arquivo));
    setNomeArquivo(arquivo.name);
    setProdutoSelecionado(undefined);
  }

  function montarItem() {
    return {
      nome: nomeItem,
      hue: produtoSelecionado?.hue ?? 200,
      tamanho,
      tamanhoLabel: TAMANHOS.find((t) => t.id === tamanho)!.label,
      moldura,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material,
      materialLabel: MATERIAIS.find((m) => m.id === material)!.label,
      personalizado: permitirTrocarImagem || moldura !== "sem-moldura" || material !== "tela-canvas",
      precoUnitario: preco,
      quantidade,
    };
  }

  function handleAdicionar() {
    adicionar(montarItem());
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2500);
  }

  function handleComprarAgora() {
    adicionar(montarItem());
    router.push("/carrinho");
  }

  return (
    <div className={ocultarImagem ? "" : "grid md:grid-cols-2 gap-8 md:gap-[32px]"}>
      {!ocultarImagem && (
        <div>
          {imagemPropria ? (
            <div
              style={
                molduraAtual?.cor
                  ? { background: molduraAtual.cor, padding: "3.2%" }
                  : undefined
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemPropria}
                alt={nomeArquivo ?? "Imagem enviada pelo cliente"}
                className="w-full h-auto block"
              />
            </div>
          ) : (
            <ArtPlate
              hue={produtoSelecionado?.hue ?? 200}
              orientacao={produtoSelecionado?.orientacao ?? "retrato"}
              molduraColor={molduraAtual?.cor ?? null}
            />
          )}
        </div>
      )}

      <div>
        <p className="text-[28px] md:text-[32px] leading-tight mb-1">{formatarPreco(preco)}</p>
        <p className="text-[14px] text-black/50 mb-[17px]">Frete calculado no carrinho.</p>

        <div className="inline-flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 text-[13px] tracking-artu mb-[24px]">
          <span aria-hidden="true">✓</span> PRODUÇÃO SOB ENCOMENDA
        </div>

        {permitirTrocarImagem && (
          <div className="border-t border-black py-[17px]">
            <p className="text-[16px] tracking-artu mb-[11px]">IMAGEM</p>
            <div className="grid grid-cols-4 gap-2 mb-[17px]">
              {produtos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProdutoSelecionado(p);
                    setImagemPropria(null);
                  }}
                  aria-label={p.nome}
                  className="block group"
                  style={{
                    outline:
                      produtoSelecionado?.id === p.id && !imagemPropria
                        ? "2px solid black"
                        : "none",
                    outlineOffset: "2px",
                  }}
                >
                  <ArtPlate hue={p.hue} orientacao={p.orientacao} hoverZoom />
                </button>
              ))}
            </div>
            <label className="text-[16px] tracking-artu underline cursor-pointer">
              ENVIAR IMAGEM PRÓPRIA
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            {nomeArquivo && <p className="text-[16px] mt-2 text-black/60">{nomeArquivo}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 py-[17px] border-t border-black">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] tracking-artu text-black/60">TAMANHO</span>
            <select
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value as TamanhoId)}
              className="border border-black/30 px-3 py-2 text-[16px] bg-transparent"
            >
              {TAMANHOS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13px] tracking-artu text-black/60">MATERIAL</span>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as MaterialId)}
              className="border border-black/30 px-3 py-2 text-[16px] bg-transparent"
            >
              {MATERIAIS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 py-[17px] border-t border-black">
          <span className="text-[13px] tracking-artu text-black/60">MOLDURA</span>
          <select
            value={moldura}
            onChange={(e) => setMoldura(e.target.value as MolduraId)}
            className="border border-black/30 px-3 py-2 text-[16px] bg-transparent"
          >
            {MOLDURAS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-stretch gap-4 py-[17px] border-t border-black">
          <div className="flex items-center border border-black">
            <button
              type="button"
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-[18px]"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="px-4 text-[16px] min-w-[32px] text-center">{quantidade}</span>
            <button
              type="button"
              onClick={() => setQuantidade((q) => q + 1)}
              className="px-4 py-2 text-[18px]"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdicionar}
            className="flex-1 border border-black px-6 py-3 text-[16px] tracking-artu"
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>

        <div
          className={
            comprarFixoNoMobile
              ? "fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:mb-[17px]"
              : "mb-[17px]"
          }
        >
          <button
            type="button"
            onClick={handleComprarAgora}
            className="w-full bg-black text-white px-6 py-4 text-[16px] tracking-artu"
          >
            COMPRAR AGORA
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-[17px]">
          <button
            type="button"
            onClick={() => setTestandoAmbiente(true)}
            className="text-[16px] tracking-artu underline"
          >
            TESTAR NO MEU AMBIENTE
          </button>
          {adicionado && (
            <button
              type="button"
              onClick={() => router.push("/carrinho")}
              className="text-[16px] tracking-artu text-[var(--color-brand)] underline"
            >
              VER CARRINHO
            </button>
          )}
        </div>

        <p className="text-[14px] text-black/60 border-t border-black pt-[17px]">
          📦 Frete grátis para compras acima de R$ 400
        </p>
      </div>

      {testandoAmbiente && (
        <ARPreview
          aspectRatio={aspectRatio}
          hue={produtoSelecionado?.hue ?? 200}
          molduraColor={molduraAtual?.cor ?? null}
          imagemUrl={imagemPropria}
          onClose={() => setTestandoAmbiente(false)}
        />
      )}
    </div>
  );
}
