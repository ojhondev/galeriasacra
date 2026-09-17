import Link from "next/link";
import { listarProdutosAdmin } from "@/lib/products";
import { formatarPreco } from "@/lib/pricing";
import { excluirProdutoAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  const produtos = await listarProdutosAdmin();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <div className="flex items-center justify-between mb-[24px]">
        <h1 className="text-[28px]">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]"
        >
          + Novo produto
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
          >
            <div>
              <p className="text-[15px]">
                {produto.nome} {!produto.ativo && <span className="text-black/40">(inativo)</span>}
              </p>
              <p className="text-[13px] text-black/50">
                {produto.sku} · {produto.categoria} · {formatarPreco(produto.precoBase)} ·{" "}
                {produto.estoque} em estoque
              </p>
            </div>
            <div className="flex items-center gap-x-5 text-[13px]">
              <Link href={`/admin/produtos/${produto.id}`} className="underline">
                Editar
              </Link>
              <form action={excluirProdutoAction.bind(null, produto.id)}>
                <button type="submit" className="underline text-[var(--color-brand)]">
                  Excluir
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
