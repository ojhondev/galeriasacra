import { listarTodasAvaliacoes } from "@/lib/avaliacoes";
import { listarProdutosAdmin } from "@/lib/products";
import { criarAvaliacaoAction, excluirAvaliacaoAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAvaliacoesPage() {
  const [avaliacoes, produtos] = await Promise.all([listarTodasAvaliacoes(), listarProdutosAdmin()]);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Avaliações</h1>

      <form action={criarAvaliacaoAction} className="flex flex-wrap items-end gap-4 mb-[42px] max-w-3xl">
        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">PRODUTO</span>
          <select
            name="produtoId"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent min-w-[200px]"
          >
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">CLIENTE</span>
          <input
            name="nomeCliente"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">NOTA (1-5)</span>
          <input
            type="number"
            name="nota"
            required
            min={1}
            max={5}
            defaultValue={5}
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent w-[80px]"
          />
        </label>

        <label className="flex flex-col gap-1 flex-1 min-w-[240px]">
          <span className="text-[16px] tracking-artu">COMENTÁRIO</span>
          <input
            name="comentario"
            required
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <button type="submit" className="bg-black text-white px-6 py-3 text-[16px] tracking-artu">
          ADICIONAR
        </button>
      </form>

      <div className="flex flex-col">
        {avaliacoes.map((avaliacao) => (
          <div
            key={avaliacao.id}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-black py-[17px]"
          >
            <div>
              <p className="text-[18px]">
                {"★".repeat(avaliacao.nota)}
                {"☆".repeat(5 - avaliacao.nota)} — {avaliacao.nomeCliente}
              </p>
              <p className="text-[14px] text-black/50">
                {avaliacao.produto?.nome} · {avaliacao.comentario}
              </p>
            </div>
            <form action={excluirAvaliacaoAction.bind(null, avaliacao.id)}>
              <button type="submit" className="underline text-[var(--color-brand)] text-[16px] tracking-artu">
                EXCLUIR
              </button>
            </form>
          </div>
        ))}
        <div className="border-t border-black" />
      </div>
    </div>
  );
}
