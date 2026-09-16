"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtPlate } from "@/components/ArtPlate";
import { HairlineDivider } from "@/components/HairlineDivider";
import { useCart } from "@/lib/cart";
import { formatarPreco } from "@/lib/pricing";

export default function CarrinhoPage() {
  const { itens, remover, atualizarQuantidade, esvaziar, total } = useCart();
  const [finalizado, setFinalizado] = useState(false);

  if (finalizado) {
    return (
      <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
        <h1 className="text-[32px] mb-4">Pedido recebido</h1>
        <p className="text-[20px] max-w-xl">
          Recebemos seu pedido. Em breve entraremos em contato para confirmar produção e
          pagamento. Esta é uma etapa de demonstração — nenhum pagamento foi processado.
        </p>
        <Link href="/quadros" className="text-[18px] tracking-artu underline mt-[42px] inline-block">
          VOLTAR PARA QUADROS
        </Link>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
        <h1 className="text-[32px] mb-4">Carrinho</h1>
        <p className="text-[20px]">Seu carrinho está vazio.</p>
        <Link href="/quadros" className="text-[18px] tracking-artu underline mt-[42px] inline-block">
          VER QUADROS
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[42px]">Carrinho</h1>

      <div className="flex flex-col gap-[42px]">
        {itens.map((item) => (
          <div key={item.id}>
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-6 items-start">
              <ArtPlate hue={item.hue} orientacao="retrato" />
              <div className="flex flex-col gap-2">
                <p className="text-[20px]">{item.nome}</p>
                <p className="text-[18px] text-black/60">{item.tamanhoLabel}</p>
                <p className="text-[18px] text-black/60">{item.molduraLabel}</p>
                <p className="text-[18px] text-black/60">{item.materialLabel}</p>
                <div className="flex items-center gap-x-6 mt-2">
                  <label className="text-[18px] tracking-artu" htmlFor={`qtd-${item.id}`}>
                    QTD
                  </label>
                  <input
                    id={`qtd-${item.id}`}
                    type="number"
                    min={1}
                    value={item.quantidade}
                    onChange={(e) => atualizarQuantidade(item.id, Number(e.target.value))}
                    className="w-16 border-b border-black bg-transparent text-[18px] outline-none"
                  />
                  <p className="text-[20px] ml-auto md:ml-0">
                    {formatarPreco(item.precoUnitario * item.quantidade)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remover(item.id)}
                    className="text-[18px] tracking-artu underline text-[var(--color-signal-red)]"
                  >
                    REMOVER
                  </button>
                </div>
              </div>
            </div>
            <HairlineDivider className="mt-[42px]" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-[42px] max-w-lg ml-auto">
        <p className="text-[24px]">Total</p>
        <p className="text-[24px]">{formatarPreco(total)}</p>
      </div>

      <div className="flex items-center gap-x-8 mt-[32px] justify-end">
        <button type="button" onClick={esvaziar} className="text-[18px] tracking-artu underline">
          ESVAZIAR CARRINHO
        </button>
        <button
          type="button"
          onClick={() => setFinalizado(true)}
          className="text-[18px] tracking-artu underline"
        >
          FINALIZAR PEDIDO
        </button>
      </div>
    </div>
  );
}
