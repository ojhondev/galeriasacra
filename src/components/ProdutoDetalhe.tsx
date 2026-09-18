"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProdutoGaleria } from "@/components/ProdutoGaleria";
import { Customizer } from "@/components/Customizer";
import { Accordion } from "@/components/Accordion";
import { Estrelas } from "@/components/Estrelas";
import { HairlineDivider } from "@/components/HairlineDivider";
import { ObraTile } from "@/components/ObraTile";
import { formatarPreco, precoRange } from "@/lib/pricing";
import { calcularMedia, type Avaliacao } from "@/lib/avaliacoes-shared";
import { registrarProdutoVisto } from "@/lib/produto-visto";
import { MOLDURAS, type MolduraId } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

type ProdutoDetalheProps = {
  produto: Produto;
  alternativas: Produto[];
  combinaCom: Produto[];
  avaliacoes: Avaliacao[];
  freteGratisMinimo: number;
};

export function ProdutoDetalhe({
  produto,
  alternativas,
  combinaCom,
  avaliacoes,
  freteGratisMinimo,
}: ProdutoDetalheProps) {
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const molduraColor = MOLDURAS.find((m) => m.id === moldura)?.cor ?? null;
  const imagemUrl = produto.imagens?.[moldura] ?? null;
  const media = calcularMedia(avaliacoes);

  useEffect(() => {
    registrarProdutoVisto({ nome: produto.nome, slug: produto.slug });
  }, [produto.id, produto.nome, produto.slug]);

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
          <h1 className="text-[clamp(26px,4.5vw,40px)] leading-tight mb-2">{produto.nome}</h1>

          {avaliacoes.length > 0 && (
            <div className="flex items-center gap-2 mb-[17px]">
              <Estrelas nota={media} />
              <span className="text-[14px] text-black/60">
                {media.toFixed(1)} ({avaliacoes.length}{" "}
                {avaliacoes.length === 1 ? "avaliação" : "avaliações"})
              </span>
            </div>
          )}

          <Customizer
            produto={produto}
            onMolduraChange={setMoldura}
            comprarFixoNoMobile
            freteGratisMinimo={freteGratisMinimo}
          />

          {combinaCom.length > 0 && (
            <div className="border-t border-black py-[17px]">
              <p className="text-[16px] mb-[11px]">Costuma Combinar Com</p>
              <div className="grid grid-cols-2 gap-3">
                {combinaCom.map((item) => (
                  <div key={item.id}>
                    <ObraTile
                      slug={item.slug}
                      nome={item.nome}
                      hue={item.hue}
                      orientacao={item.orientacao}
                      imagemUrl={item.imagens?.["sem-moldura"]}
                    />
                    <p className="text-[14px] mt-1">{item.nome}</p>
                    <p className="text-[13px] text-black/50">
                      {formatarPreco(precoRange(item.precoBase).min)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Accordion titulo="Sobre">
            {produto.descricaoLonga.map((paragrafo, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragrafo}
              </p>
            ))}
          </Accordion>
          <Accordion titulo="Materiais">
            <p>
              Impressão de alta definição sobre tela canvas, papel fine art ou acrílico, com
              fidelidade de cor testada para longa duração.
            </p>
          </Accordion>
          <Accordion titulo="Envio">
            <p>
              Cada peça é produzida sob encomenda. Prazo de produção e envio informado no
              carrinho antes da finalização da compra.
            </p>
          </Accordion>
          <Accordion titulo="Trocas e Devoluções">
            <p>
              Consulte nossa{" "}
              <Link href="/trocas-e-devolucoes" className="underline">
                política de trocas e devoluções
              </Link>
              .
            </p>
          </Accordion>
          {avaliacoes.length > 0 && (
            <Accordion titulo={`Avaliações (${avaliacoes.length})`}>
              <div className="flex flex-col gap-[17px]">
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <Estrelas nota={avaliacao.nota} tamanho={14} />
                      <span className="text-[14px] font-medium">{avaliacao.nomeCliente}</span>
                    </div>
                    <p className="text-[15px] text-black/70">{avaliacao.comentario}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <ProdutoGaleria produto={produto} molduraColor={molduraColor} imagemUrl={imagemUrl} />
        </div>
      </div>

      <div className="px-4 md:px-8 py-[80px]">
        <HairlineDivider className="mb-[42px]" />
        <p className="text-[18px] mb-[29px]">Outras Obras</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {alternativas.map((alt) => (
            <div key={alt.id}>
              <ObraTile
                slug={alt.slug}
                nome={alt.nome}
                hue={alt.hue}
                orientacao={alt.orientacao}
                imagemUrl={alt.imagens?.["sem-moldura"]}
              />
              <p className="text-[18px] mt-[11px]">{alt.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
