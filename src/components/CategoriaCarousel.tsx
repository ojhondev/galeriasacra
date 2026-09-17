import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

export function CategoriaCarousel({ produtos }: { produtos: Produto[] }) {
  const categorias = Array.from(new Set(produtos.map((p) => p.categoria))).map((categoria) => {
    const representante = produtos.find((p) => p.categoria === categoria)!;
    return { categoria, hue: representante.hue };
  });

  return (
    <section className="px-4 md:px-8 py-[64px]">
      <div className="flex items-center justify-between mb-[24px]">
        <p className="text-[13px] tracking-artu text-black/50">Compre por Categoria</p>
        <Link href="/quadros" className="text-[14px] underline">
          Ver tudo →
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {categorias.map(({ categoria, hue }) => (
          <Link
            key={categoria}
            href={`/quadros?categoria=${encodeURIComponent(categoria)}`}
            className="relative block shrink-0 w-[240px] md:w-[280px] aspect-[3/4] snap-start"
          >
            <ArtPlate hue={hue} fill className="w-full h-full" />
            <div className="absolute inset-0 bg-black/20" />
            <p className="absolute bottom-4 left-4 text-white text-[20px] font-medium">
              {categoria}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
