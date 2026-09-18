"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewDrawer } from "@/components/QuickViewDrawer";
import type { Produto } from "@/lib/products";

type EtiquetaResumo = { label: string; tipo: "percentual" | "fixo"; valor: number };

export function HomeProductSections({
  maisVendidos,
  emPromocao,
}: {
  maisVendidos: Produto[];
  emPromocao: { produto: Produto; etiqueta: EtiquetaResumo }[];
}) {
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);

  return (
    <>
      <section className="px-4 md:px-8 py-[64px]">
        <div className="flex items-center justify-between mb-[32px]">
          <p className="text-[28px] md:text-[36px]">Mais Vendidos</p>
          <Link href="/quadros" className="bg-black text-white px-5 py-3 text-[14px] rounded-[6px]">
            Ver Catálogo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[32px] justify-items-center">
          {maisVendidos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} onQuickView={setProdutoQuickView} />
          ))}
        </div>
      </section>

      {emPromocao.length > 0 && (
        <section className="px-4 md:px-8 pb-[64px]">
          <div className="flex items-center justify-between mb-[32px]">
            <p className="text-[28px] md:text-[36px]">Ofertas</p>
            <Link href="/quadros" className="bg-black text-white px-5 py-3 text-[14px] rounded-[6px]">
              Ver Todas
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[32px] justify-items-center">
            {emPromocao.map(({ produto, etiqueta }) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                etiqueta={etiqueta}
                onQuickView={setProdutoQuickView}
              />
            ))}
          </div>
        </section>
      )}

      <QuickViewDrawer produto={produtoQuickView} onClose={() => setProdutoQuickView(null)} />
    </>
  );
}
