import type { Metadata } from "next";
import { MonteSeuQuadroWizard } from "@/components/MonteSeuQuadroWizard";
import { listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Monte Seu Quadro | Galeria Sacra",
};

export const dynamic = "force-dynamic";

export default async function MonteSeuQuadroPage() {
  const produtos = await listarProdutos();

  return <MonteSeuQuadroWizard produtos={produtos} />;
}
