import Image from "next/image";
import { listarColecoes } from "@/lib/colecoes";
import { criarColecaoAction, excluirColecaoAction } from "@/lib/colecoes-actions";

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
          <span className="text-[13px] text-black/50">URL da imagem</span>
          <input
            name="imagemUrl"
            placeholder="/categorias/teste-generico.jpg"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[240px]"
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
          colecoes.map((colecao) => (
            <div
              key={colecao.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={colecao.imagemUrl}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-[6px] object-cover shrink-0 bg-[#f2f2ef]"
                />
                <div>
                  <p className="text-[15px]">
                    {colecao.nome} {!colecao.ativo && <span className="text-black/40">(inativa)</span>}
                  </p>
                  <p className="text-[13px] text-black/50">Ordem {colecao.ordem}</p>
                </div>
              </div>
              <form action={excluirColecaoAction.bind(null, colecao.id)}>
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
