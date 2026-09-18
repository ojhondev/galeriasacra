"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ARPreview } from "@/components/ARPreview";
import { FreteCalculadora } from "@/components/FreteCalculadora";
import { UltimasUnidadesToast } from "@/components/UltimasUnidadesToast";
import { IconCheck, IconLock, IconRefresh, IconWhatsApp } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { registrarProdutoVisto } from "@/lib/produto-visto";
import { TESTAR_AMBIENTE_HABILITADO } from "@/lib/feature-flags";
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
  produto: Produto;
  onMolduraChange?: (moldura: MolduraId) => void;
  comprarFixoNoMobile?: boolean;
  freteGratisMinimo?: number;
};

export function Customizer({
  produto,
  onMolduraChange,
  comprarFixoNoMobile = false,
  freteGratisMinimo = 400,
}: CustomizerProps) {
  const router = useRouter();
  const { adicionar } = useCart();

  const [tamanho, setTamanho] = useState<TamanhoId>("40x60");
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const [material, setMaterial] = useState<MaterialId>("tela-canvas");
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [testandoAmbiente, setTestandoAmbiente] = useState(false);

  const preco = useMemo(
    () => calcularPreco(produto.precoBase, tamanho, moldura, material),
    [produto.precoBase, tamanho, moldura, material],
  );

  const molduraAtual = MOLDURAS.find((m) => m.id === moldura);
  const aspectRatio = aspectRatioDoTamanho(tamanho, produto.orientacao);
  const esgotado = produto.estoque <= 0;
  const estoqueBaixo = produto.estoque > 0 && produto.estoque <= 5;
  const parcela = preco / 12;

  useEffect(() => {
    onMolduraChange?.(moldura);
  }, [moldura, onMolduraChange]);

  function montarItem() {
    return {
      nome: produto.nome,
      hue: produto.hue,
      imagemUrl: produto.imagens?.[moldura] ?? null,
      tamanho,
      tamanhoLabel: TAMANHOS.find((t) => t.id === tamanho)!.label,
      moldura,
      molduraLabel: MOLDURAS.find((m) => m.id === moldura)!.label,
      material,
      materialLabel: MATERIAIS.find((m) => m.id === material)!.label,
      personalizado: moldura !== "sem-moldura" || material !== "tela-canvas",
      precoUnitario: preco,
      quantidade,
    };
  }

  function handleAdicionar() {
    adicionar(montarItem());
    registrarProdutoVisto({ nome: produto.nome, slug: produto.slug });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2500);
  }

  function handleComprarAgora() {
    adicionar(montarItem());
    registrarProdutoVisto({ nome: produto.nome, slug: produto.slug });
    router.push("/carrinho");
  }

  return (
    <div>
      <p className="text-[28px] md:text-[32px] leading-tight mb-1">{formatarPreco(preco)}</p>
      <p className="text-[14px] text-black/60 mb-1">
        ou 12x de {formatarPreco(parcela)} sem juros
      </p>
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

      <div className="grid grid-cols-2 gap-4 py-[17px] border-t border-black">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/60">Tamanho</span>
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
          <span className="text-[13px] text-black/60">Material</span>
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
        <span className="text-[13px] text-black/60">Moldura</span>
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
          onClick={handleAdicionar}
          disabled={esgotado}
          className="flex-1 border border-black px-6 py-3 text-[16px] rounded-[6px] disabled:opacity-40"
        >
          {esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
        </button>
      </div>

      <div
        className={
          comprarFixoNoMobile
            ? "fixed bottom-16 inset-x-0 z-40 bg-white border-t border-black px-4 py-3 flex flex-col gap-2 lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:gap-3 lg:mb-[17px]"
            : "flex flex-col gap-3 mb-[17px]"
        }
      >
        <button
          type="button"
          onClick={handleComprarAgora}
          disabled={esgotado}
          className="w-full text-white px-6 py-4 text-[16px] rounded-[6px] disabled:opacity-40"
          style={{ background: "var(--color-brand)" }}
        >
          {esgotado ? "Esgotado" : "Comprar Agora"}
        </button>

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

      {adicionado && (
        <div className="mb-[17px]">
          <button
            type="button"
            onClick={() => router.push("/carrinho")}
            className="text-[16px] text-[var(--color-brand)] underline"
          >
            Ver Carrinho
          </button>
        </div>
      )}

      <a
        href={`https://wa.me/5514998570045?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre o quadro "${produto.nome}".`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[14px] underline mb-[17px] text-[#25D366]"
      >
        <IconWhatsApp /> Dúvidas? Fale conosco no WhatsApp
      </a>

      <FreteCalculadora />

      <p className="text-[14px] text-black/60 border-t border-black pt-[17px]">
        Frete grátis para compras acima de {formatarPreco(freteGratisMinimo)}
      </p>

      {estoqueBaixo && <UltimasUnidadesToast estoque={produto.estoque} />}

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
