import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconEye } from "@/components/icons";
import { precoRange, formatarPreco, aplicarDesconto } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

type EtiquetaResumo = { label: string; tipo: "percentual" | "fixo"; valor: number };

export function ProductCard({
  produto,
  onQuickView,
  etiqueta,
}: {
  produto: Produto;
  onQuickView?: (produto: Produto) => void;
  etiqueta?: EtiquetaResumo;
}) {
  const { min } = precoRange(produto.precoBase);
  const minComDesconto = etiqueta ? aplicarDesconto(min, etiqueta) : min;

  return (
    <Link
      href={`/quadros/${produto.slug}`}
      className="block group relative z-0 hover:z-10 w-full max-w-[340px] mx-auto"
      aria-label={produto.nome}
    >
      <div className="relative aspect-square bg-[#f2f2ef] p-[8%] overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <p className="absolute top-[6%] left-[8%] text-[13px] tracking-artu text-black/60 z-10">
          {produto.categoria.toUpperCase()}
        </p>

        {etiqueta && (
          <span className="absolute top-[6%] right-[8%] z-10 bg-black text-white px-2.5 py-1 text-[12px] rounded-[6px]">
            {etiqueta.label}
          </span>
        )}

        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(produto);
            }}
            aria-label={`Visualização rápida de ${produto.nome}`}
            className="absolute bottom-[6%] right-[8%] z-10 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[6px]"
          >
            <IconEye />
          </button>
        )}

        <div className="relative w-full h-full">
          <ArtPlate
            hue={produto.hue}
            fill
            className="w-full h-full transition-opacity duration-300 group-hover:opacity-0"
          />
          <div className="absolute inset-0">
            <ArtPlate
              hue={produto.hue}
              fill
              inverso
              className="w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-black px-6 py-3 text-[14px] tracking-artu rounded-[6px]">
            Ver Detalhes
          </span>
        </div>
      </div>

      <div className="mt-[11px]">
        <p className="text-[18px]">{produto.nome}</p>

        {produto.etiquetasInfo.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {produto.etiquetasInfo.map((label) => (
              <span
                key={label}
                className="text-[11px] tracking-artu text-black/60 bg-black/5 px-2 py-1 rounded-[6px]"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1">
          {etiqueta ? (
            <p className="text-[14px]">
              <span className="text-black/40 line-through mr-2">{formatarPreco(min)}</span>
              <span className="text-[var(--color-brand)]">{formatarPreco(minComDesconto)}</span>
            </p>
          ) : (
            <p className="text-[14px] text-black/60">A partir de {formatarPreco(min)}</p>
          )}
          <p className="text-[15px] font-medium">
            ou 12x de {formatarPreco(Math.round((etiqueta ? minComDesconto : min) / 12))} sem juros
          </p>
        </div>
      </div>
    </Link>
  );
}
