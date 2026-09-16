import { notFound } from "next/navigation";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { getProdutoPorId } from "@/lib/products";
import { atualizarProdutoAction } from "@/lib/admin-actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const produto = await getProdutoPorId(id);
  if (!produto) notFound();

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Editar Produto</h1>
      <ProdutoForm produto={produto} action={atualizarProdutoAction.bind(null, id)} />
    </div>
  );
}
