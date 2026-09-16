import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Customizer } from "@/components/Customizer";
import { HairlineDivider } from "@/components/HairlineDivider";
import { ArtPlate } from "@/components/ArtPlate";
import { getProdutoBySlug, produtos } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = getProdutoBySlug(slug);
  if (!produto) return {};
  return { title: `${produto.nome} | Galeria Sacra` };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const produto = getProdutoBySlug(slug);
  if (!produto) notFound();

  const alternativas = produtos.filter((p) => p.id !== produto.id).slice(0, 4);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px] max-w-[var(--page-max-width)] mx-auto">
      <Customizer produtoInicial={produto} />

      <div className="mt-[80px] max-w-3xl">
        <p className="text-[18px] tracking-artu mb-[17px]">SOBRE</p>
        {produto.descricaoLonga.map((paragrafo, i) => (
          <p key={i} className="text-[20px] leading-[1.2] mb-4">
            {paragrafo}
          </p>
        ))}
      </div>

      <HairlineDivider className="my-[80px]" />

      <div>
        <p className="text-[18px] tracking-artu mb-[29px]">OUTRAS OBRAS</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px]">
          {alternativas.map((alt) => (
            <Link key={alt.id} href={`/quadros/${alt.slug}`} className="block">
              <ArtPlate hue={alt.hue} orientacao={alt.orientacao} />
              <p className="text-[18px] mt-[11px]">{alt.nome}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
