import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import { IconChevronRight } from "@/components/icons";
import type { Orientacao } from "@/lib/products";

type ObraTileProps = {
  slug: string;
  nome: string;
  orientacao: Orientacao;
  imagemUrl?: string | null;
  className?: string;
};

export function ObraTile({ slug, nome, orientacao, imagemUrl = null, className = "" }: ObraTileProps) {
  return (
    <Link
      href={`/quadros/${slug}`}
      className={`block group relative z-0 hover:z-10 overflow-hidden transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <ArtPlate orientacao={orientacao} imagemUrl={imagemUrl} />
      <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/95 px-3 py-1.5 text-[13px] tracking-artu">{nome}</span>
        <span className="bg-white w-8 h-8 flex items-center justify-center rounded-[6px] shrink-0">
          <IconChevronRight />
        </span>
      </div>
    </Link>
  );
}
