"use client";

import { useState } from "react";
import Link from "next/link";
import { ProdutoGaleria } from "@/components/ProdutoGaleria";
import { Customizer } from "@/components/Customizer";
import { Accordion } from "@/components/Accordion";
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
      <div className="px-4 md:px-8 pt-[24px] text-[14px] text-black/50">
        <Link href="/">Home</Link> / <Link href="/quadros">Quadros</Link> /{" "}
        <span>{produto.categoria}</span> / <span className="text-black">{produto.nome}</span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-[42px] px-4 md:px-8 py-[24px] pb-[100px] lg:pb-[24px]">
        <div className="order-2 lg:order-1">
          <p className="text-[13px] tracking-artu text-black/60 mb-2">
            {produto.categoria.toUpperCase()}
          </p>
          <h1 className="text-[32px] md:text-[40px] leading-tight mb-[17px]">{produto.nome}</h1>

          <Customizer
            produtoInicial={produto}
            produtos={produtos}
            ocultarImagem
            onMolduraChange={setMolduraColor}
            comprarFixoNoMobile
          />

          <Accordion titulo="SOBRE">
            {produto.descricaoLonga.map((paragrafo, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragrafo}
              </p>
            ))}
          </Accordion>
          <Accordion titulo="MATERIAIS">
            <p>
              Impressão de alta definição sobre tela canvas, papel fine art ou acrílico, com
              fidelidade de cor testada para longa duração.
            </p>
          </Accordion>
          <Accordion titulo="ENVIO">
            <p>
              Cada peça é produzida sob encomenda. Prazo de produção e envio informado no
              carrinho antes da finalização da compra.
            </p>
          </Accordion>
          <Accordion titulo="TROCAS E DEVOLUÇÕES">
            <p>
              Consulte nossa{" "}
              <Link href="/trocas-e-devolucoes" className="underline">
                política de trocas e devoluções
              </Link>
              .
            </p>
          </Accordion>
        </div>

        <div className="order-1 lg:order-2">
          <ProdutoGaleria
            produto={produto}
            molduraColor={molduraColor}
            prevSlug={prevSlug}
            nextSlug={nextSlug}
          />
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
