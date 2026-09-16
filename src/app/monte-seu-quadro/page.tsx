import type { Metadata } from "next";
import { Customizer } from "@/components/Customizer";
import { listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Monte Seu Quadro | Artusa",
};

export const dynamic = "force-dynamic";

export default async function MonteSeuQuadroPage() {
  const produtos = await listarProdutos();

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-4">Monte Seu Quadro</h1>
      <p className="text-[20px] leading-[1.2] max-w-2xl mb-[42px]">
        Escolha uma imagem do nosso catálogo ou envie a sua própria imagem, depois defina
        tamanho, moldura e material. Seu quadro, do seu jeito.
      </p>
      <Customizer produtos={produtos} permitirTrocarImagem />
    </div>
  );
}
