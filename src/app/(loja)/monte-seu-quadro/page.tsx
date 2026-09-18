import type { Metadata } from "next";
import { MonteSeuQuadroWizard } from "@/components/MonteSeuQuadroWizard";
import { listarProdutos } from "@/lib/products";
import { listarColecoesAtivas } from "@/lib/colecoes";

export const metadata: Metadata = {
  title: "Monte Seu Quadro | Galeria Sacra",
};

export const dynamic = "force-dynamic";

export default async function MonteSeuQuadroPage() {
  const [produtos, colecoes] = await Promise.all([listarProdutos(), listarColecoesAtivas()]);

  return <MonteSeuQuadroWizard produtos={produtos} colecoes={colecoes} />;
}
