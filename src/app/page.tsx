import Link from "next/link";
import { SplitHero } from "@/components/SplitHero";
import { FeatureIconsRow } from "@/components/FeatureIconsRow";
import { CategoriasDestaque } from "@/components/CategoriasDestaque";
import { CategoriaCarousel } from "@/components/CategoriaCarousel";
import { PromoBanner } from "@/components/PromoBanner";
import { FAQSection } from "@/components/FAQSection";
import { ContactCTA } from "@/components/ContactCTA";
import { ProductCard } from "@/components/ProductCard";
import { HairlineDivider } from "@/components/HairlineDivider";
import { listarProdutos } from "@/lib/products";
import { listarEtiquetasAtivas } from "@/lib/etiquetas";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [produtos, etiquetasAtivas] = await Promise.all([listarProdutos(), listarEtiquetasAtivas()]);

  const maisVendidos = produtos.slice(0, 4);

  const etiquetasPorProduto = new Map(
    etiquetasAtivas.filter((e) => e.produtoId).map((e) => [e.produtoId as string, e]),
  );
  const emPromocao = produtos.filter((p) => etiquetasPorProduto.has(p.id)).slice(0, 4);
  const etiquetaGlobal = etiquetasAtivas.find((e) => !e.produtoId);

  return (
    <div>
      <SplitHero />

      <FeatureIconsRow />

      <HairlineDivider />

      <CategoriasDestaque produtos={produtos} />

      <HairlineDivider />

      <section className="px-4 md:px-8 py-[64px]">
        <div className="flex items-center justify-between mb-[32px]">
          <p className="text-[28px] md:text-[36px]">Mais Vendidos</p>
          <Link href="/quadros" className="bg-black text-white px-5 py-3 text-[14px]">
            Ver Catálogo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[32px]">
          {maisVendidos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </section>

      {emPromocao.length > 0 && (
        <section className="px-4 md:px-8 pb-[64px]">
          <div className="flex items-center justify-between mb-[32px]">
            <p className="text-[28px] md:text-[36px]">Ofertas</p>
            <Link href="/quadros" className="bg-black text-white px-5 py-3 text-[14px]">
              Ver Todas
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-[32px]">
            {emPromocao.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                etiqueta={etiquetasPorProduto.get(produto.id)}
              />
            ))}
          </div>
        </section>
      )}

      {etiquetaGlobal && <PromoBanner label={etiquetaGlobal.label} />}

      <CategoriaCarousel produtos={produtos} />

      <HairlineDivider />

      <FAQSection />

      <ContactCTA />
    </div>
  );
}
