"use client";

import { useState } from "react";
import Link from "next/link";
import { ProdutoVisual } from "@/components/ProdutoVisual";
import { Customizer } from "@/components/Customizer";
import { HairlineDivider } from "@/components/HairlineDivider";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

type ProdutoDetalheProps = {
  produto: Produto;
  prevSlug: string;
  nextSlug: string;
  alternativas: Produto[];
  produtos: Produto[];
};

export function ProdutoDetalhe({ produto, prevSlug, nextSlug, alternativas, produtos }: ProdutoDetalheProps) {
  const [molduraColor, setMolduraColor] = useState<string | null>(null);

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2">
        <ProdutoVisual
          produto={produto}
          molduraColor={molduraColor}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
        />

        <div className="px-4 md:px-8 py-[42px] lg:py-[100px]">
          <Customizer
            produtoInicial={produto}
            produtos={produtos}
            ocultarImagem
            onMolduraChange={setMolduraColor}
          />

          <div className="mt-[17px]">
            <div className="border-t border-black py-[17px]">
              <p className="text-[18px] tracking-artu mb-[11px]">SOBRE</p>
              {produto.descricaoLonga.map((paragrafo, i) => (
                <p key={i} className="text-[20px] leading-[1.2] mb-4 last:mb-0">
                  {paragrafo}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-[80px]">
        <HairlineDivider className="mb-[42px]" />
        <p className="text-[18px] tracking-artu mb-[29px]">OUTRAS OBRAS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {alternativas.map((alt) => (
            <Link key={alt.id} href={`/quadros/${alt.slug}`} className="block group">
              <ArtPlate hue={alt.hue} orientacao={alt.orientacao} hoverZoom />
              <p className="text-[18px] mt-[11px]">{alt.nome}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
