"use client";

import { useState } from "react";
import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconEye } from "@/components/icons";
import { precoRange, formatarPreco, aplicarDesconto, MOLDURAS, type MolduraId } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

type EtiquetaResumo = { label: string; tipo: "percentual" | "fixo"; valor: number };

const DESCONTO_CUPOM_SACRA10 = 10;

function notaAleatoria(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const fracao = (Math.abs(hash) % 1000) / 1000;
  return Math.round((4.3 + fracao * (4.9 - 4.3)) * 10) / 10;
}

export function ProductCard({
  produto,
  onQuickView,
  etiqueta,
}: {
  produto: Produto;
  onQuickView?: (produto: Produto) => void;
  etiqueta?: EtiquetaResumo;
}) {
  const [moldura, setMoldura] = useState<MolduraId>("sem-moldura");
  const { min } = precoRange(produto.precoBase);
  const minComDesconto = etiqueta ? aplicarDesconto(min, etiqueta) : min;
  const minComCupom = Math.round(min * (1 - DESCONTO_CUPOM_SACRA10 / 100));
  const molduraCor = MOLDURAS.find((m) => m.id === moldura)?.cor ?? null;
  const nota = notaAleatoria(produto.id);

  return (
    <Link
      href={`/quadros/${produto.slug}`}
      className="block group relative z-0 hover:z-10 w-full max-w-[340px] mx-auto"
      aria-label={produto.nome}
    >
      <div className="relative aspect-[3/4] bg-[#f2f2ef] overflow-hidden flex flex-col p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col items-start gap-1 min-w-0">
            <span className="bg-white text-black px-2 py-1 text-[10px] tracking-artu uppercase rounded-[6px]">
              {produto.categoria}
            </span>
            {produto.etiquetasInfo.map((label) => (
              <span
                key={label}
                className="bg-white/90 text-black/70 px-2 py-1 text-[10px] tracking-artu rounded-[6px]"
              >
                {label}
              </span>
            ))}
          </div>

          {etiqueta && (
            <span className="shrink-0 bg-black text-white px-2.5 py-1 text-[12px] rounded-[6px]">
              {etiqueta.label}
            </span>
          )}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
            <ArtPlate
              hue={produto.hue}
              fill
              molduraColor={molduraCor}
              className="w-full h-full transition-opacity duration-300 group-hover:opacity-0"
            />
            <div className="absolute inset-0">
              <ArtPlate
                hue={produto.hue}
                fill
                inverso
                molduraColor={molduraCor}
                className="w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </div>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(produto);
              }}
              aria-label={`Visualização rápida de ${produto.nome}`}
              className="absolute bottom-2 right-2 z-10 w-9 h-9 bg-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 rounded-[6px]"
            >
              <IconEye />
            </button>
          )}

          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="bg-white text-black px-6 py-3 text-[14px] tracking-artu rounded-[6px]">
              Ver Detalhes
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 md:gap-1.5 mt-2">
          {MOLDURAS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoldura(m.id);
              }}
              aria-label={m.label}
              title={m.label}
              className={`w-4 h-4 md:w-5 md:h-5 shrink-0 rounded-full shadow transition-transform ${
                moldura === m.id ? "scale-110 ring-2 ring-black/30 ring-offset-1 ring-offset-[#f2f2ef]" : ""
              }`}
              style={{ background: m.cor ?? "#ffffff", border: m.cor ? "none" : "1px solid #00000030" }}
            />
          ))}
        </div>
      </div>

      <div className="mt-[11px]">
        <p className="text-[18px] font-semibold">{produto.nome}</p>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-black/30 text-[14px]">★</span>
          <span className="text-[13px] text-black/50">{nota.toFixed(1)}</span>
        </div>

        <div className="mt-1">
          {etiqueta ? (
            <p className="text-[14px]">
              <span className="text-black/40 line-through mr-2">{formatarPreco(min)}</span>
              <span className="text-[var(--color-brand)]">{formatarPreco(minComDesconto)}</span>
            </p>
          ) : (
            <p className="text-[14px] text-black/60">A partir de {formatarPreco(minComCupom)}</p>
          )}
          <p className="text-[15px] font-semibold">
            ou 12x de{" "}
            {formatarPreco(Math.round((etiqueta ? minComDesconto : minComCupom) / 12))} sem juros
          </p>
          {!etiqueta && (
            <p className="text-[12px] text-[var(--color-brand)] mt-0.5">COM CUPOM SACRA10</p>
          )}
        </div>
      </div>
    </Link>
  );
}
