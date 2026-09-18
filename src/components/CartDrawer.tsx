"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconClose } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatarPreco } from "@/lib/pricing";

export function CartDrawer() {
  const { itens, remover, total, drawerAberto, fecharDrawer } = useCart();

  useEffect(() => {
    if (!drawerAberto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerAberto]);

  return (
    <div className={`fixed inset-0 z-50 ${drawerAberto ? "" : "pointer-events-none"}`} aria-hidden={!drawerAberto}>
      <div
        onClick={fecharDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerAberto ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute bg-white flex flex-col transition-transform duration-300
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-[6px]
          md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[420px] md:max-h-none md:rounded-none
          ${drawerAberto ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 md:px-8 py-[17px] border-b border-black shrink-0">
          <p className="text-[16px] font-medium">Carrinho ({itens.length})</p>
          <button type="button" onClick={fecharDrawer} aria-label="Fechar">
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-[17px]">
          {itens.length === 0 ? (
            <p className="text-[16px] text-black/60 py-8 text-center">Seu carrinho está vazio.</p>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {itens.map((item) => (
                <div key={item.id} className="grid grid-cols-[70px_1fr] gap-4 items-start">
                  <ArtPlate hue={item.hue} orientacao="retrato" imagemUrl={item.imagemUrl} />
                  <div>
                    <p className="text-[15px]">{item.nome}</p>
                    <p className="text-[13px] text-black/50">
                      {item.tamanhoLabel} · {item.molduraLabel}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[14px] text-black/60">Qtd. {item.quantidade}</p>
                      <p className="text-[15px]">{formatarPreco(item.precoUnitario * item.quantidade)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remover(item.id)}
                      className="text-[13px] underline text-[var(--color-brand)] mt-1"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {itens.length > 0 && (
          <div className="border-t border-black px-4 md:px-8 py-[17px] shrink-0">
            <div className="flex items-center justify-between mb-[17px]">
              <p className="text-[18px]">Total</p>
              <p className="text-[18px]">{formatarPreco(total)}</p>
            </div>
            <Link
              href="/carrinho"
              onClick={fecharDrawer}
              className="block w-full bg-black text-white text-center px-6 py-3 text-[15px]"
            >
              Ver Carrinho Completo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
