import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
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
  const { min, max } = precoRange(produto.precoBase);
  const minComDesconto = etiqueta ? aplicarDesconto(min, etiqueta) : min;

  return (
    <Link href={`/quadros/${produto.slug}`} className="block group" aria-label={produto.nome}>
      <div className="relative aspect-[2/1] bg-[#f2f2ef] p-[8%] overflow-hidden">
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
            className="absolute bottom-[6%] right-[8%] z-10 w-9 h-9 bg-white flex items-center justify-center text-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[6px]"
          >
            ⊕
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
        {etiqueta ? (
          <p className="text-[16px]">
            <span className="text-black/40 line-through mr-2">{formatarPreco(min)}</span>
            <span className="text-[var(--color-brand)]">{formatarPreco(minComDesconto)}</span>
          </p>
        ) : (
          <p className="text-[16px] text-black/60">
            {formatarPreco(min)} – {formatarPreco(max)}
          </p>
        )}
        <p className="text-[14px] text-black/50 mt-1">{produto.descricaoCurta}</p>
      </div>
    </Link>
  );
}
