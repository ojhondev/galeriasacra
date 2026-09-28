"use client";

import { useEffect, useMemo, useState } from "react";
import { ARPreview } from "@/components/ARPreview";
import { FreteCalculadora } from "@/components/FreteCalculadora";
import { IconCheck, IconLock, IconRefresh } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { registrarProdutoVisto } from "@/lib/produto-visto";
import { TESTAR_AMBIENTE_HABILITADO } from "@/lib/feature-flags";
import {
  MATERIAIS,
  MATERIAL_PADRAO,
  MOLDURAS,
  TAMANHOS,
  calcularPreco,
  formatarPreco,
  precoRange,
  type MolduraId,
  type TamanhoId,
} from "@/lib/pricing";
import type { Produto, Orientacao } from "@/lib/products";

function aspectRatioDoTamanho(tamanhoId: TamanhoId | null, orientacao: Orientacao): number {
  if (orientacao === "quadrado") return 1;
  const [a, b] = (tamanhoId ?? "40x60").split("x").map(Number);
  const [largura, altura] = orientacao === "paisagem" ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
  return largura / altura;
}

function CartaoOpcao({
  ativo,
  disabled,
  onClick,
  label,
  cor,
}: {
  ativo: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  cor?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-2 shrink-0 w-[92px] snap-start text-center disabled:opacity-30"
    >
      <span
        className={`relative w-full aspect-[3/4] rounded-[6px] overflow-hidden border-2 ${
          ativo ? "border-black" : "border-transparent"
        }`}
        style={{ background: cor ?? "#f2f2ef" }}
      >
        {ativo && (
          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
            <IconCheck className="w-3 h-3" />
          </span>
        )}
      </span>
      <span className={`text-[12px] leading-tight ${ativo ? "font-medium text-black" : "text-black/60"}`}>
        {label}
      </span>
    </button>
  );
}

type CustomizerProps = {
  produto: Produto;
  onMolduraChange?: (moldura: MolduraId) => void;
  comprarFixoNoMobile?: boolean;
};

export function Customizer({ produto, onMolduraChange, comprarFixoNoMobile = false }: CustomizerProps) {
  const { adicionar, abrirDrawer } = useCart();

  const [tamanho, setTamanho] = useState<TamanhoId | null>(null);
  const [moldura, setMoldura] = useState<MolduraId | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const preco = useMemo(
    () => (tamanho && moldura ? calcularPreco(produto.precoBase, tamanho, moldura, MATERIAL_PADRAO) : null),
    [produto.precoBase, tamanho, moldura],
  );
  const faixaPreco = useMemo(() => precoRange(produto.precoBase), [produto.precoBase]);

  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const aspectRatio = aspectRatioDoTamanho(tamanho, produto.orientacao);
  const esgotado = produto.estoque <= 0;
  const estoqueBaixo = produto.estoque > 0 && produto.estoque <= 5;
  const podeComprar = !esgotado && tamanho !== null && moldura !== null;

  useEffect(() => {
    if (moldura) onMolduraChange?.(moldura);
  }, [moldura, onMolduraChange]);

  function montarItem() {
    return {
      nome: produto.nome,
      hue: produto.hue,
      imagemUrl: produto.imagens?.[moldura!] ?? null,
      tamanho: tamanho!,
      tamanhoLabel: TAMANHOS.find((t) => t.id === tamanho)!.label,
      moldura: moldura!,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material: MATERIAL_PADRAO,
      materialLabel: MATERIAIS[0].label,
      personalizado: true,
      precoUnitario: preco!,
      quantidade,
    };
  }

  function handleComprarAgora() {
    adicionar(montarItem());
    registrarProdutoVisto({ nome: produto.nome, slug: produto.slug });
    abrirDrawer();
  }

  return (
    <div>
      {preco !== null ? (
        <>
          <p className="text-[28px] md:text-[32px] leading-tight mb-1">{formatarPreco(preco)}</p>
          <p className="text-[14px] text-black/60 mb-1">ou em até 12x de {formatarPreco(preco / 12)} sem juros</p>
        </>
      ) : (
        <>
          <p className="text-[28px] md:text-[32px] leading-tight mb-1">
            A partir de {formatarPreco(faixaPreco.min)}
          </p>
          <p className="text-[14px] text-black/60 mb-1">
            ou em até 12x de {formatarPreco(faixaPreco.min / 12)} sem juros
          </p>
        </>
      )}
      <p className="text-[14px] text-black/50 mb-[17px]">Frete calculado no carrinho.</p>

      <div className="flex flex-wrap gap-2 mb-[24px]">
        <div className="inline-flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 text-[13px]">
          <IconCheck className="w-4 h-4" /> Produção sob encomenda
        </div>
        <div className="inline-flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 text-[13px]">
          <IconLock /> Compra segura
        </div>
        <div className="inline-flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 text-[13px]">
          <IconRefresh /> Garantia de 7 dias
        </div>
      </div>

      {esgotado ? (
        <p className="text-[14px] text-[var(--color-brand)] mb-[24px]">
          Esgotado — sem unidades físicas disponíveis no momento.
        </p>
      ) : (
        estoqueBaixo && (
          <p className="text-[14px] text-[var(--color-brand)] mb-[24px]">
            Restam apenas {produto.estoque} {produto.estoque === 1 ? "unidade" : "unidades"}!
          </p>
        )
      )}

      <div className="py-[17px] border-t border-black">
        <p className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
          <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center shrink-0">
            1
          </span>
          Escolha a Medida (L×A)
        </p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          {TAMANHOS.map((t) => (
            <CartaoOpcao key={t.id} ativo={tamanho === t.id} onClick={() => setTamanho(t.id)} label={t.label} />
          ))}
        </div>
        <p className="text-[13px] text-black/50 mt-3">{MATERIAIS[0].label}</p>
      </div>

      <div className="py-[17px] border-t border-black">
        <p className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
          <span
            className={`w-5 h-5 rounded-full text-white text-[11px] flex items-center justify-center shrink-0 ${
              tamanho ? "bg-black" : "bg-black/30"
            }`}
          >
            2
          </span>
          Escolha a Moldura
        </p>
        {!tamanho && (
          <p className="text-[13px] text-black/40 mb-3">Escolha a medida acima para liberar as molduras.</p>
        )}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          {MOLDURAS.map((m) => (
            <CartaoOpcao
              key={m.id}
              ativo={moldura === m.id}
              disabled={!tamanho}
              onClick={() => setMoldura(m.id)}
              label={m.label.replace(/^Moldura /, "")}
              cor={m.cor}
            />
          ))}
        </div>
      </div>

      <div
        className={
          comprarFixoNoMobile
            ? "fixed bottom-16 inset-x-0 z-40 bg-white border-t border-black px-4 py-3 flex flex-col gap-2 lg:static lg:bg-transparent lg:border-t lg:border-black lg:p-0 lg:gap-3 lg:pt-[17px] lg:mb-[17px]"
            : "flex flex-col gap-3 py-[17px] border-t border-black mb-[17px]"
        }
      >
        <div className="flex items-stretch gap-3">
          <div className="flex items-center border border-black shrink-0">
            <button
              type="button"
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              disabled={esgotado}
              className="px-4 py-2 text-[18px] disabled:opacity-30"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="px-4 text-[16px] min-w-[32px] text-center">{quantidade}</span>
            <button
              type="button"
              onClick={() => setQuantidade((q) => Math.min(produto.estoque, q + 1))}
              disabled={esgotado || quantidade >= produto.estoque}
              className="px-4 py-2 text-[18px] disabled:opacity-30"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleComprarAgora}
            disabled={!podeComprar}
            className="flex-1 text-white px-6 py-4 text-[16px] rounded-[6px] disabled:opacity-40"
            style={{ background: "var(--color-brand)" }}
          >
            {esgotado ? "Esgotado" : "Comprar Agora"}
          </button>
        </div>

        {TESTAR_AMBIENTE_HABILITADO && (
          <button
            type="button"
            onClick={() => setTestandoAmbiente(true)}
            className="w-full border border-black px-6 py-4 text-[16px] rounded-[6px]"
          >
            Testar no Meu Ambiente
          </button>
        )}
      </div>

      <FreteCalculadora />

      {testandoAmbiente && (
        <ARPreview
          aspectRatio={aspectRatio}
          hue={produto.hue}
          molduraColor={molduraAtual?.cor ?? null}
          imagemUrl={null}
          onClose={() => setTestandoAmbiente(false)}
        />
      )}
    </div>
  );
}
