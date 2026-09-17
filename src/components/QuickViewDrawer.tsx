"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { Customizer } from "@/components/Customizer";
import type { Produto } from "@/lib/products";

function QuickViewConteudo({ produto }: { produto: Produto }) {
  const [molduraColor, setMolduraColor] = useState<string | null>(null);

  return (
    <div className="px-4 md:px-8 py-[24px]">
      <ArtPlate
        hue={produto.hue}
        orientacao={produto.orientacao}
        molduraColor={molduraColor}
        className="mb-[24px]"
      />

      <p className="text-[13px] tracking-artu text-black/60 mb-2">
        {produto.categoria.toUpperCase()}
      </p>
      <h2 className="text-[26px] leading-tight mb-[17px]">{produto.nome}</h2>

      <Customizer produto={produto} onMolduraChange={setMolduraColor} />

      <Link
        href={`/quadros/${produto.slug}`}
        className="text-[14px] tracking-artu underline block mt-[17px]"
      >
        VER PÁGINA COMPLETA →
      </Link>
    </div>
  );
}

export function QuickViewDrawer({
  produto,
  onClose,
}: {
  produto: Produto | null;
  onClose: () => void;
}) {
  const [produtoExibido, setProdutoExibido] = useState<Produto | null>(null);

  useEffect(() => {
    if (produto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mantém o último produto exibido durante a animação de saída (fade/slide), antes de desmontar
      setProdutoExibido(produto);
      return;
    }
    const timer = setTimeout(() => setProdutoExibido(null), 300);
    return () => clearTimeout(timer);
  }, [produto]);

  useEffect(() => {
    if (!produto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [produto]);

  const aberto = produto !== null;

  return (
    <div
      className={`fixed inset-0 z-50 ${aberto ? "" : "pointer-events-none"}`}
      aria-hidden={!aberto}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white overflow-y-auto transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 py-[17px] border-b border-black sticky top-0 bg-white z-10">
          <p className="text-[14px] tracking-artu">VISUALIZAÇÃO RÁPIDA</p>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-[20px]">
            ✕
          </button>
        </div>

        {produtoExibido && <QuickViewConteudo key={produtoExibido.id} produto={produtoExibido} />}
      </div>
    </div>
  );
}
