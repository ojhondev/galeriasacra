import type { Metadata } from "next";
import { HairlineDivider } from "@/components/HairlineDivider";

export const metadata: Metadata = {
  title: "Sobre | Artusa",
};

export default function SobrePage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[42px] max-w-2xl">Sobre a Artusa</h1>

      <div className="max-w-2xl flex flex-col gap-8">
        <p className="text-[24px] leading-[1.15]">
          A Artusa nasceu para aproximar a arte sacra do dia a dia — em casas,
          capelas e espaços de oração.
        </p>
        <p className="text-[20px] leading-[1.2]">
          Trabalhamos com um catálogo próprio de quadros religiosos, ícones e santos, e
          acreditamos que cada peça deve caber no espaço e na fé de quem a recebe. Por
          isso, todo quadro do nosso catálogo pode ser totalmente personalizado — tamanho,
          moldura e material — na seção Monte Seu Quadro.
        </p>
        <p className="text-[20px] leading-[1.2]">
          O foco inicial da galeria são os quadros, mas estamos construindo aos poucos um
          catálogo mais amplo de produtos sacros.
        </p>
      </div>

      <HairlineDivider className="my-[80px]" />

      <div className="max-w-2xl flex flex-col gap-6">
        <p className="text-[18px] tracking-artu">PRODUÇÃO</p>
        <p className="text-[20px] leading-[1.2]">
          Impressão em alta definição, com fidelidade de cor testada para grandes formatos
          e acabamento sob medida em cada pedido.
        </p>
      </div>
    </div>
  );
}
