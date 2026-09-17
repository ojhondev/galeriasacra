import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";

export function SplitHero() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/sacra-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
          <p className="text-[13px] tracking-artu mb-3">Nova Coleção</p>
          <h1 className="text-[clamp(28px,4.5vw,48px)] leading-[1.05] font-medium mb-6 max-w-md">
            Arte sacra que transforma o espaço
          </h1>
          <Link
            href="/quadros"
            className="bg-white text-black px-6 py-3 text-[15px] w-fit hover:bg-black hover:text-white transition-colors"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>

      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <ArtPlate hue={28} fill className="w-full h-full" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
          <p className="text-[13px] tracking-artu mb-3">Personalize</p>
          <h1 className="text-[clamp(28px,4.5vw,48px)] leading-[1.05] font-medium mb-6 max-w-md">
            Monte o seu quadro do seu jeito
          </h1>
          <Link
            href="/monte-seu-quadro"
            className="bg-white text-black px-6 py-3 text-[15px] w-fit hover:bg-black hover:text-white transition-colors"
          >
            Monte Seu Quadro
          </Link>
        </div>
      </div>
    </section>
  );
}
