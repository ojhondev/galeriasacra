import { SplitHero } from "@/components/SplitHero";
import { FeatureIconsRow } from "@/components/FeatureIconsRow";
import { CategoriasDestaque } from "@/components/CategoriasDestaque";
import { CategoriaCarousel } from "@/components/CategoriaCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { FAQSection } from "@/components/FAQSection";
import { ContactCTA } from "@/components/ContactCTA";
import { HomeProductSections } from "@/components/HomeProductSections";
import { HairlineDivider } from "@/components/HairlineDivider";
import { listarProdutos } from "@/lib/products";
import { listarEtiquetasAtivas } from "@/lib/etiquetas";
import { listarColecoesAtivas } from "@/lib/colecoes";
import { obterConfigLoja } from "@/lib/frete";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [produtos, etiquetasAtivas, colecoes, configLoja] = await Promise.all([
    listarProdutos(),
    listarEtiquetasAtivas(),
    listarColecoesAtivas(),
    obterConfigLoja(),
  ]);

  const maisVendidos = produtos.slice(0, 4);

  const etiquetasPorProduto = new Map(
    etiquetasAtivas.filter((e) => e.produtoId).map((e) => [e.produtoId as string, e]),
  );
  const emPromocao = produtos
    .filter((p) => etiquetasPorProduto.has(p.id))
    .slice(0, 4)
    .map((produto) => ({ produto, etiqueta: etiquetasPorProduto.get(produto.id)! }));
  const etiquetaGlobal = etiquetasAtivas.find((e) => !e.produtoId);

  return (
    <div>
      <SplitHero />

      <HairlineDivider />

      <CategoriasDestaque produtos={produtos} colecoes={colecoes} />

      <HairlineDivider />

      <HomeProductSections maisVendidos={maisVendidos} emPromocao={emPromocao} />

      {etiquetaGlobal && <PromoBanner label={etiquetaGlobal.label} />}

      <CategoriaCarousel colecoes={colecoes} />

      <HairlineDivider />

      <FAQSection />

      <ContactCTA />

      <HairlineDivider />

      <FeatureIconsRow freteGratisMinimo={configLoja.freteGratisMinimo} />
    </div>
  );
}
