import Link from "next/link";
import { ArtPlate } from "@/components/ArtPlate";

export function ContactCTA() {
  return (
    <section className="px-4 md:px-8 py-[64px]">
      <div className="bg-[#f2f2ef] grid md:grid-cols-[1fr_320px] items-center">
        <div className="p-8 md:p-10">
          <p className="text-[28px] md:text-[36px] mb-3">Fale com a gente</p>
          <p className="text-[16px] text-black/60 mb-6 max-w-md">
            Dúvidas sobre um pedido, personalização ou prazo de entrega? Estamos a uma mensagem
            de distância.
          </p>
          <Link href="/contato" className="bg-black text-white px-6 py-3 text-[15px] w-fit inline-block">
            Enviar Mensagem
          </Link>
        </div>
        <div className="h-[220px] md:h-[220px]">
          <ArtPlate hue={44} fill className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
