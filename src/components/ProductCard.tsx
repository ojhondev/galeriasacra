import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { precoRange, formatarPreco } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

export function ProductCard({ produto }: { produto: Produto }) {
  const { min, max } = precoRange(produto.precoBase);

  return (
    <Link href={`/quadros/${produto.slug}`} className="block group" aria-label={produto.nome}>
      <div className="relative aspect-square bg-[#f2f2ef] p-[8%] overflow-hidden">
        <p className="absolute top-[6%] left-[8%] text-[13px] tracking-artu text-black/60 z-10">
          {produto.categoria.toUpperCase()}
        </p>

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
          <span className="bg-white text-black px-6 py-3 text-[14px] tracking-artu">
            OLHAR DETALHES
          </span>
        </div>
      </div>

      <div className="mt-[11px]">
        <p className="text-[18px]">{produto.nome}</p>
        <p className="text-[16px] text-black/60">
          {formatarPreco(min)} – {formatarPreco(max)}
        </p>
        <p className="text-[14px] text-black/50 mt-1">{produto.descricaoCurta}</p>
      </div>
    </Link>
  );
}
