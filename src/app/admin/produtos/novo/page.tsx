import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { criarProdutoAction } from "@/lib/admin-actions";

export default function NovoProdutoPage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Novo Produto</h1>
      <ProdutoForm action={criarProdutoAction} />
    </div>
  );
}
