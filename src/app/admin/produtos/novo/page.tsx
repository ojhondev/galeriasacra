import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { criarProdutoAction } from "@/lib/admin-actions";
import { listarColecoes } from "@/lib/colecoes";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const colecoes = await listarColecoes();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Novo produto</h1>
      <ProdutoForm action={criarProdutoAction} colecoes={colecoes} />
    </div>
  );
}
