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
import { MOLDURAS, MOLDURA_PADRAO, type MolduraId } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

type ProdutoDetalheProps = {
  produto: Produto;
  alternativas: Produto[];
  combinaCom: Produto[];
  avaliacoes: Avaliacao[];
};

export function ProdutoDetalhe({ produto, alternativas, combinaCom, avaliacoes }: ProdutoDetalheProps) {
  const [moldura, setMoldura] = useState<MolduraId>(MOLDURA_PADRAO);
  const molduraColor = MOLDURAS.find((m) => m.id === moldura)?.cor ?? null;
  const imagemUrl = produto.imagens?.[moldura] ?? null;
  const media = calcularMedia(avaliacoes);

  useEffect(() => {
    registrarProdutoVisto({ nome: produto.nome, slug: produto.slug });
  }, [produto.id, produto.nome, produto.slug]);

  const blocoInfo = (
    <>
      <Accordion titulo="Sobre">
        {produto.descricaoLonga.map((paragrafo, i) => (
          <p key={i} className="mb-3 last:mb-0">
            {paragrafo}
          </p>
        ))}
      </Accordion>
      <Accordion titulo="Materiais">
        <p>
          Impressão de alta definição sobre tela canvas 100% algodão, com fidelidade de cor
          testada para longa duração.
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
    </>
  );

  return (
    <div>
      <div className="px-4 md:px-8 pt-[24px] text-[14px] text-black/50">
        <Link href="/">Home</Link> / <Link href="/quadros">Quadros</Link> /{" "}
        <span>{produto.categoria}</span> / <span className="text-black">{produto.nome}</span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start gap-[42px] px-4 md:px-8 py-[24px] pb-[24px]">
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

          <Customizer produto={produto} onMolduraChange={setMoldura} comprarFixoNoMobile />
        </div>

        <div className="order-1 lg:order-2 lg:max-w-[440px] lg:mx-auto lg:w-full">
          <ProdutoGaleria produto={produto} molduraColor={molduraColor} imagemUrl={imagemUrl} />
          <div className="hidden lg:block pt-[24px]">{blocoInfo}</div>
        </div>

        <div className="order-3 lg:hidden max-w-2xl">{blocoInfo}</div>
      </div>

      {combinaCom.length > 0 && (
        <div className="px-4 md:px-8 py-[42px] bg-[#faf9f7]">
          <p className="text-[24px] md:text-[28px] font-medium mb-[24px]">Costuma Combinar Com</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px] md:gap-[32px]">
            {combinaCom.map((item) => (
              <div key={item.id}>
                <ObraTile
                  slug={item.slug}
                  nome={item.nome}
                  orientacao={item.orientacao}
                  imagemUrl={item.imagens?.[MOLDURA_PADRAO]}
                />
                <p className="text-[16px] md:text-[18px] mt-[11px]">{item.nome}</p>
                <p className="text-[14px] text-black/50">{formatarPreco(precoRange(item.precoBase).min)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 pt-[80px] pb-[160px] lg:pb-[80px]">
        <HairlineDivider className="mb-[42px]" />
        <p className="text-[18px] mb-[29px]">Outras Obras</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {alternativas.map((alt) => (
            <div key={alt.id}>
              <ObraTile
                slug={alt.slug}
                nome={alt.nome}
                orientacao={alt.orientacao}
                imagemUrl={alt.imagens?.[MOLDURA_PADRAO]}
              />
              <p className="text-[18px] mt-[11px]">{alt.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
