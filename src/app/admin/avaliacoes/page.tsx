import { listarTodasAvaliacoes } from "@/lib/avaliacoes";
import { listarProdutosAdmin } from "@/lib/products";
import { criarAvaliacaoAction, excluirAvaliacaoAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const [avaliacoes, produtos] = await Promise.all([listarTodasAvaliacoes(), listarProdutosAdmin()]);

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Avaliações</h1>

      <form
        action={criarAvaliacaoAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Produto</span>
          <select
            name="produtoId"
            required
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
          >
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Cliente</span>
          <input
            name="nomeCliente"
            required
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Nota (1-5)</span>
          <input
            type="number"
            name="nota"
            required
            min={1}
            max={5}
            defaultValue={5}
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[80px]"
          />
        </label>

        <label className="flex flex-col gap-1 flex-1 min-w-[240px]">
          <span className="text-[13px] text-black/50">Comentário</span>
          <input
            name="comentario"
            required
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
          />
        </label>

        <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
          Adicionar
        </button>
      </form>

      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
        {avaliacoes.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhuma avaliação ainda.</p>
        ) : (
          avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div>
                <p className="text-[15px]">
                  {"★".repeat(avaliacao.nota)}
                  {"☆".repeat(5 - avaliacao.nota)} — {avaliacao.nomeCliente}
                </p>
                <p className="text-[13px] text-black/50">
                  {avaliacao.produto?.nome} · {avaliacao.comentario}
                </p>
              </div>
              <form action={excluirAvaliacaoAction.bind(null, avaliacao.id)}>
                <button type="submit" className="underline text-[var(--color-brand)] text-[13px]">
                  Excluir
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
