import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProdutoDetalhe } from "@/components/ProdutoDetalhe";
import { getProdutoBySlug, listarProdutos } from "@/lib/products";
import { listarAvaliacoesPorProduto } from "@/lib/avaliacoes";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) return {};
  return { title: `${produto.nome} | Galeria Sacra` };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) notFound();

  const [produtos, avaliacoes] = await Promise.all([
    listarProdutos(),
    listarAvaliacoesPorProduto(produto.id),
  ]);
  const indiceAtual = produtos.findIndex((p) => p.id === produto.id);
  const anterior = produtos[(indiceAtual - 1 + produtos.length) % produtos.length];
  const proximo = produtos[(indiceAtual + 1) % produtos.length];
  const alternativas = produtos.filter((p) => p.id !== produto.id).slice(0, 4);
  const combinaCom = produtos
    .filter((p) => p.id !== produto.id && p.categoria === produto.categoria)
    .slice(0, 2);
  const combinaComFinal = combinaCom.length > 0
    ? combinaCom
    : produtos.filter((p) => p.id !== produto.id).slice(0, 2);

  return (
    <ProdutoDetalhe
      produto={produto}
      prevSlug={anterior.slug}
      nextSlug={proximo.slug}
      alternativas={alternativas}
      combinaCom={combinaComFinal}
      avaliacoes={avaliacoes}
    />
  );
}
