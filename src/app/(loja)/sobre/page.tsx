import type { Metadata } from "next";
import { HairlineDivider } from "@/components/HairlineDivider";

export const metadata: Metadata = {
  title: "Sobre | Galeria Sacra",
};

export default function SobrePage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[42px] max-w-2xl">Sobre a Galeria Sacra</h1>

      <div className="max-w-2xl flex flex-col gap-8">
        <p className="text-[24px] leading-[1.15]">
          A Galeria Sacra é especializada em arte sacra para igrejas, paróquias e
          instituições religiosas — unindo tradição, personalização e acabamento
          profissional em cada projeto.
        </p>
        <p className="text-[20px] leading-[1.2]">
          Não trabalhamos com o quadro de santo genérico para casa: nosso foco são
          projetos institucionais, desenvolvidos sob medida para o espaço, a identidade e
          a devoção de cada templo. Tamanho, moldura e material são definidos junto com a
          instituição na seção Monte Seu Quadro.
        </p>
        <p className="text-[20px] leading-[1.2]">
          Atendemos igrejas, capelas, paróquias, seminários e congregações que buscam
          elevar seus espaços de fé com peças exclusivas — e estamos construindo aos
          poucos um catálogo mais amplo de produtos sacros para instituições.
        </p>
      </div>

      <HairlineDivider className="my-[80px]" />

      <div className="max-w-2xl flex flex-col gap-6">
        <p className="text-[16px] tracking-artu text-black/50">Produção</p>
        <p className="text-[20px] leading-[1.2]">
          Impressão em alta definição, com fidelidade de cor testada para grandes formatos
          e acabamento profissional sob medida — pensado para projetos institucionais de
          qualquer escala.
        </p>
      </div>
    </div>
  );
}
