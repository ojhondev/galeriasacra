import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

export function ProductCard({ produto }: { produto: Produto }) {
  return (
    <Link href={`/quadros/${produto.slug}`} className="block group" aria-label={produto.nome}>
      <div className="aspect-square bg-[#f2f2ef] p-[8%]">
        <ArtPlate hue={produto.hue} fill hoverZoom className="w-full h-full" />
      </div>
    </Link>
  );
}
