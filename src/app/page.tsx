import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ObraTile } from "@/components/ObraTile";
import { CategoriasDestaque } from "@/components/CategoriasDestaque";
import { HairlineDivider } from "@/components/HairlineDivider";
import { VideoParallax } from "@/components/VideoParallax";
import { listarProdutos } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const produtos = await listarProdutos();
  const grade1 = produtos.slice(0, 4);
  const grade2 = produtos.slice(4, 8);

  return (
    <div>
      <Hero />

      <section className="px-4 md:px-8 py-[80px]">
        <p className="text-[clamp(28px,6vw,56px)] leading-[1.05] tracking-artu">
          Galeria Sacra reúne arte sacra contemporânea, dedicada a criar quadros
          que elevam espaços de fé, memória e contemplação.
        </p>
      </section>

      <section className="px-4 md:px-8 pb-[80px]">
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[32px]">
          <ObraTile
            slug={grade1[0].slug}
            nome={grade1[0].nome}
            hue={grade1[0].hue}
            orientacao={grade1[0].orientacao}
            className="col-span-2 md:w-[52%]"
          />
          <ObraTile
            slug={grade1[1].slug}
            nome={grade1[1].nome}
            hue={grade1[1].hue}
            orientacao="quadrado"
            className="md:w-[38%]"
          />
          <ObraTile
            slug={grade1[2].slug}
            nome={grade1[2].nome}
            hue={grade1[2].hue}
            orientacao={grade1[2].orientacao}
            className="md:w-[28%]"
          />
          <ObraTile
            slug={grade1[3].slug}
            nome={grade1[3].nome}
            hue={grade1[3].hue}
            orientacao="paisagem"
            className="md:w-[45%]"
          />
        </div>
      </section>

      <HairlineDivider />

      <CategoriasDestaque produtos={produtos} />

      <HairlineDivider />

      <section className="px-4 md:px-8 py-[80px]">
        <p className="text-[clamp(22px,4.2vw,44px)] leading-[1.1] tracking-artu">
          Especializada em quadros sacros, ícones e peças sob encomenda, a Galeria
          Sacra oferece obras pensadas para lares, capelas e espaços de oração. Cada peça é
          impressa e emoldurada sob medida, unindo tradição religiosa e cuidado artesanal.
        </p>
        <p className="text-[clamp(18px,3vw,32px)] leading-[1.15] tracking-artu mt-8">
          Além do catálogo, todo quadro pode ser personalizado — tamanho, moldura e
          acabamento — na seção{" "}
          <Link href="/monte-seu-quadro" className="underline">
            Monte Seu Quadro
          </Link>
          .
        </p>
      </section>

      <section className="px-4 md:px-8 pb-[80px]">
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[32px]">
          <ObraTile
            slug={grade2[0].slug}
            nome={grade2[0].nome}
            hue={grade2[0].hue}
            orientacao={grade2[0].orientacao}
            className="md:w-[30%]"
          />
          <ObraTile
            slug={grade2[1].slug}
            nome={grade2[1].nome}
            hue={grade2[1].hue}
            orientacao="paisagem"
            className="col-span-2 md:w-[55%]"
          />
          <ObraTile
            slug={grade2[2].slug}
            nome={grade2[2].nome}
            hue={grade2[2].hue}
            orientacao={grade2[2].orientacao}
            className="md:w-[40%]"
          />
          <ObraTile
            slug={grade2[3].slug}
            nome={grade2[3].nome}
            hue={grade2[3].hue}
            orientacao={grade2[3].orientacao}
            className="md:w-[42%]"
          />
        </div>
      </section>

      <VideoParallax />
    </div>
  );
}
