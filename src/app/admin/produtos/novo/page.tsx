import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { criarProdutoAction } from "@/lib/admin-actions";

export default function NovoProdutoPage() {
  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Novo produto</h1>
      <ProdutoForm action={criarProdutoAction} />
    </div>
  );
}
