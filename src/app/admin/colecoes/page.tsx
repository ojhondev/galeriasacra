import { listarColecoes } from "@/lib/colecoes";
import { criarColecaoAction } from "@/lib/colecoes-actions";
import { ColecaoRow } from "@/components/admin/ColecaoRow";
import { NovaColecaoImagem } from "@/components/admin/NovaColecaoImagem";

export const dynamic = "force-dynamic";

export default async function AdminColecoesPage() {
  const colecoes = await listarColecoes();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-2">Coleções</h1>
      <p className="text-[14px] text-black/50 mb-[24px] max-w-2xl">
        As categorias usadas no menu, nas categorias circulares e no filtro de produtos. O nome aqui
        precisa bater com a categoria escolhida em cada produto.
      </p>

      <form
        action={criarColecaoAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-6"
      >
        <NovaColecaoImagem />

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Nome</span>
          <input
            name="nome"
            required
            placeholder="Ex: Santos e Santas"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[220px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Ordem</span>
          <input
            type="number"
            name="ordem"
            defaultValue={0}
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[100px]"
          />
        </label>

        <label className="flex items-center gap-2 pb-2">
          <input type="checkbox" name="ativo" defaultChecked />
          <span className="text-[13px] text-black/50">Ativa</span>
        </label>

        <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
          Adicionar
        </button>
      </form>

      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
        {colecoes.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhuma coleção ainda.</p>
        ) : (
          colecoes.map((colecao) => <ColecaoRow key={colecao.id} colecao={colecao} />)
        )}
      </div>
    </div>
  );
}
