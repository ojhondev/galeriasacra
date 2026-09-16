import type { Metadata } from "next";
import { Customizer } from "@/components/Customizer";

export const metadata: Metadata = {
  title: "Monte Seu Quadro | Galeria Sacra",
};

export default function MonteSeuQuadroPage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px] max-w-[var(--page-max-width)] mx-auto">
      <h1 className="text-[32px] mb-4">Monte Seu Quadro</h1>
      <p className="text-[20px] leading-[1.2] max-w-2xl mb-[42px]">
        Escolha uma imagem do nosso catálogo ou envie a sua própria imagem, depois defina
        tamanho, moldura e material. Seu quadro, do seu jeito.
      </p>
      <Customizer permitirTrocarImagem />
    </div>
  );
}
