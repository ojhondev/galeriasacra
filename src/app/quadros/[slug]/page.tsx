import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProdutoDetalhe } from "@/components/ProdutoDetalhe";
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
  return { title: `${produto.nome} | Artusa` };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const produto = getProdutoBySlug(slug);
  if (!produto) notFound();

  const indiceAtual = produtos.findIndex((p) => p.id === produto.id);
  const anterior = produtos[(indiceAtual - 1 + produtos.length) % produtos.length];
  const proximo = produtos[(indiceAtual + 1) % produtos.length];
  const alternativas = produtos.filter((p) => p.id !== produto.id).slice(0, 4);

  return (
    <ProdutoDetalhe
      produto={produto}
      prevSlug={anterior.slug}
      nextSlug={proximo.slug}
      alternativas={alternativas}
    />
  );
}
