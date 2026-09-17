import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";

export function PromoBanner({ label }: { label: string }) {
  return (
    <section className="bg-black text-white grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-4 md:px-10 py-[64px] md:py-0">
        <p className="text-[13px] tracking-artu text-white/50 mb-3">Oferta</p>
        <p className="text-[clamp(28px,4vw,44px)] leading-[1.1] mb-6 max-w-md">{label}</p>
        <Link
          href="/quadros"
          className="bg-white text-black px-6 py-3 text-[15px] w-fit hover:bg-white/80 transition-colors"
        >
          Ver Coleção
        </Link>
      </div>
      <div className="grid grid-cols-2 h-[280px] md:h-auto">
        <ArtPlate hue={4} fill className="w-full h-full" />
        <ArtPlate hue={212} fill inverso className="w-full h-full" />
      </div>
    </section>
  );
}
