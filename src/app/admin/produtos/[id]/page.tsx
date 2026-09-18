import { notFound } from "next/navigation";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { getProdutoPorId } from "@/lib/products";
import { atualizarProdutoAction } from "@/lib/admin-actions";
import { listarColecoes } from "@/lib/colecoes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const [produto, colecoes] = await Promise.all([getProdutoPorId(id), listarColecoes()]);
  if (!produto) notFound();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Editar produto</h1>
      <ProdutoForm produto={produto} colecoes={colecoes} action={atualizarProdutoAction.bind(null, id)} />
    </div>
  );
}
