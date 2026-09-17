import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import type { Orientacao } from "@/lib/products";

type ObraTileProps = {
  slug: string;
  nome: string;
  hue: number;
  orientacao: Orientacao;
  className?: string;
};

export function ObraTile({ slug, nome, hue, orientacao, className = "" }: ObraTileProps) {
  return (
    <Link href={`/quadros/${slug}`} className={`block group relative ${className}`}>
      <ArtPlate hue={hue} orientacao={orientacao} hoverZoom />
      <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/95 px-3 py-1.5 text-[13px] tracking-artu">{nome}</span>
        <span className="bg-white w-8 h-8 flex items-center justify-center text-[16px] rounded-[6px] shrink-0">
          →
        </span>
      </div>
    </Link>
  );
}
