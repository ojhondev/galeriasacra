import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { formatarPreco } from "@/lib/pricing";
import type { Produto } from "@/lib/products";

export function ProductCard({ produto }: { produto: Produto }) {
  return (
    <Link href={`/quadros/${produto.slug}`} className="block group">
      <ArtPlate hue={produto.hue} orientacao={produto.orientacao} hoverZoom />
      <div className="pt-[11px]">
        <p className="text-[20px] leading-tight">{produto.nome}</p>
        <p className="text-[18px] text-black/60 tracking-artu">{produto.categoria}</p>
        <p className="text-[18px] mt-1">a partir de {formatarPreco(produto.precoBase * 0.75)}</p>
      </div>
    </Link>
  );
}
