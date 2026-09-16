import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ArtPlate } from "@/components/ArtPlate";
import { HairlineDivider } from "@/components/HairlineDivider";
import { produtos } from "@/lib/products";

export default function Home() {
  const destaques = produtos.slice(0, 4);
  const grade1 = produtos.slice(0, 4);
  const grade2 = produtos.slice(4, 8);

  return (
    <div>
      <HeroCarousel produtos={destaques} />

      <section className="px-4 md:px-8 py-[80px] max-w-[var(--page-max-width)] mx-auto">
        <p className="text-[24px] leading-[1.15] max-w-3xl">
          Galeria Sacra é uma galeria de arte sacra contemporânea, dedicada a criar quadros
          que elevam espaços de fé, memória e contemplação.
        </p>
      </section>

      <section className="px-4 md:px-8 pb-[80px] max-w-[var(--page-max-width)] mx-auto">
        <div className="flex flex-wrap gap-[32px]">
          <Link href={`/quadros/${grade1[0].slug}`} className="block w-full md:w-[52%]">
            <ArtPlate hue={grade1[0].hue} orientacao={grade1[0].orientacao} />
          </Link>
          <Link href={`/quadros/${grade1[1].slug}`} className="block w-full md:w-[38%]">
            <ArtPlate hue={grade1[1].hue} orientacao="quadrado" />
          </Link>
          <Link href={`/quadros/${grade1[2].slug}`} className="block w-full md:w-[28%]">
            <ArtPlate hue={grade1[2].hue} orientacao={grade1[2].orientacao} />
          </Link>
          <Link href={`/quadros/${grade1[3].slug}`} className="block w-full md:w-[45%]">
            <ArtPlate hue={grade1[3].hue} orientacao="paisagem" />
          </Link>
        </div>
      </section>

      <HairlineDivider className="max-w-[var(--page-max-width)] mx-auto" />

      <section className="px-4 md:px-8 py-[80px] max-w-[var(--page-max-width)] mx-auto">
        <p className="text-[24px] leading-[1.15] max-w-3xl">
          Especializada em quadros sacros, ícones e peças sob encomenda, a Galeria Sacra
          oferece obras pensadas para lares, capelas e espaços de oração. Cada peça é
          impressa e emoldurada sob medida, unindo tradição religiosa e cuidado artesanal.
        </p>
        <p className="text-[20px] leading-[1.2] max-w-3xl mt-8">
          Além do catálogo, todo quadro pode ser personalizado — tamanho, moldura e
          acabamento — na seção{" "}
          <Link href="/monte-seu-quadro" className="underline">
            Monte Seu Quadro
          </Link>
          .
        </p>
      </section>

      <section className="px-4 md:px-8 pb-[80px] max-w-[var(--page-max-width)] mx-auto">
        <div className="flex flex-wrap gap-[32px]">
          <Link href={`/quadros/${grade2[0].slug}`} className="block w-full md:w-[30%]">
            <ArtPlate hue={grade2[0].hue} orientacao={grade2[0].orientacao} />
          </Link>
          <Link href={`/quadros/${grade2[1].slug}`} className="block w-full md:w-[55%]">
            <ArtPlate hue={grade2[1].hue} orientacao="paisagem" />
          </Link>
          <Link href={`/quadros/${grade2[2].slug}`} className="block w-full md:w-[40%]">
            <ArtPlate hue={grade2[2].hue} orientacao={grade2[2].orientacao} />
          </Link>
          <Link href={`/quadros/${grade2[3].slug}`} className="block w-full md:w-[42%]">
            <ArtPlate hue={grade2[3].hue} orientacao={grade2[3].orientacao} />
          </Link>
        </div>
      </section>
    </div>
  );
}
