import Link from "next/link";
import { listarProdutosAdmin } from "@/lib/products";
import { formatarPreco } from "@/lib/pricing";
import { excluirProdutoAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  const produtos = await listarProdutosAdmin();

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <div className="flex items-center justify-between mb-[32px]">
        <h1 className="text-[32px]">Produtos</h1>
        <Link href="/admin/produtos/novo" className="bg-black text-white px-6 py-3 text-[16px] tracking-artu">
          + NOVO PRODUTO
        </Link>
      </div>

      <div className="flex flex-col">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-black py-[17px]"
          >
            <div>
              <p className="text-[18px]">
                {produto.nome} {!produto.ativo && <span className="text-black/40">(inativo)</span>}
              </p>
              <p className="text-[14px] text-black/50">
                {produto.sku} · {produto.categoria} · {formatarPreco(produto.precoBase)} ·{" "}
                {produto.estoque} em estoque
              </p>
            </div>
            <div className="flex items-center gap-x-6 text-[16px] tracking-artu">
              <Link href={`/admin/produtos/${produto.id}`} className="underline">
                EDITAR
              </Link>
              <form action={excluirProdutoAction.bind(null, produto.id)}>
                <button type="submit" className="underline text-[var(--color-brand)]">
                  EXCLUIR
                </button>
              </form>
            </div>
          </div>
        ))}
        <div className="border-t border-black" />
      </div>
    </div>
  );
}
