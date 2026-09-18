import { notFound } from "next/navigation";
import { ProdutoForm } from "@/components/admin/ProdutoForm";
import { getProdutoPorId } from "@/lib/products";
import {
  atualizarProdutoAction,
  criarEtiquetaAction,
  excluirEtiquetaAction,
  criarEtiquetaInfoAction,
  excluirEtiquetaInfoAction,
} from "@/lib/admin-actions";
import { listarColecoes } from "@/lib/colecoes";
import { listarEtiquetasDoProduto, listarEtiquetasInfoDoProduto } from "@/lib/etiquetas";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const [produto, colecoes, etiquetas, etiquetasInfo] = await Promise.all([
    getProdutoPorId(id),
    listarColecoes(),
    listarEtiquetasDoProduto(id),
    listarEtiquetasInfoDoProduto(id),
  ]);
  if (!produto) notFound();

  const voltarPara = `/admin/produtos/${id}`;

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Editar produto</h1>
      <ProdutoForm produto={produto} colecoes={colecoes} action={atualizarProdutoAction.bind(null, id)} />

      <div className="mt-[32px] grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/10 rounded-[6px] p-5">
          <p className="text-[16px] font-semibold mb-3">Etiquetas de desconto deste produto</p>
          <form action={criarEtiquetaAction} className="flex flex-wrap items-end gap-3 mb-4">
            <input type="hidden" name="produtoId" value={id} />
            <input type="hidden" name="voltarPara" value={voltarPara} />
            <label className="flex flex-col gap-1">
              <span className="text-[13px] text-black/50">Label</span>
              <input
                name="label"
                required
                placeholder="Ex: BLACK FRIDAY"
                className="border-b border-black/30 py-2 text-[14px] outline-none bg-transparent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] text-black/50">Tipo</span>
              <select name="tipo" className="border-b border-black/30 py-2 text-[14px] outline-none bg-transparent">
                <option value="percentual">% Percentual</option>
                <option value="fixo">R$ Fixo</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[13px] text-black/50">Valor</span>
              <input
                type="number"
                name="valor"
                required
                min={0}
                className="border-b border-black/30 py-2 text-[14px] outline-none bg-transparent w-[90px]"
              />
            </label>
            <label className="flex items-center gap-2 pb-2">
              <input type="checkbox" name="ativo" defaultChecked />
              <span className="text-[13px] text-black/50">Ativa</span>
            </label>
            <button type="submit" className="bg-black text-white px-4 py-2 text-[13px] rounded-[6px]">
              Adicionar
            </button>
          </form>

          {etiquetas.length === 0 ? (
            <p className="text-[13px] text-black/40">Nenhuma etiqueta de desconto para este produto.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {etiquetas.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 text-[14px]">
                  <span>
                    {e.label} — {e.tipo === "percentual" ? `${e.valor}%` : `R$ ${e.valor}`}{" "}
                    {!e.ativo && <span className="text-black/40">(inativa)</span>}
                  </span>
                  <form action={excluirEtiquetaAction.bind(null, e.id)}>
                    <button type="submit" className="underline text-[var(--color-brand)] text-[13px]">
                      Remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-black/10 rounded-[6px] p-5">
          <p className="text-[16px] font-semibold mb-3">Etiquetas informativas deste produto</p>
          <form action={criarEtiquetaInfoAction} className="flex flex-wrap items-end gap-3 mb-4">
            <input type="hidden" name="produtoId" value={id} />
            <input type="hidden" name="voltarPara" value={voltarPara} />
            <label className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <span className="text-[13px] text-black/50">Label</span>
              <input
                name="label"
                required
                placeholder="Ex: CHEGA EM ATÉ 7 DIAS"
                className="border-b border-black/30 py-2 text-[14px] outline-none bg-transparent"
              />
            </label>
            <label className="flex items-center gap-2 pb-2">
              <input type="checkbox" name="ativo" defaultChecked />
              <span className="text-[13px] text-black/50">Ativa</span>
            </label>
            <button type="submit" className="bg-black text-white px-4 py-2 text-[13px] rounded-[6px]">
              Adicionar
            </button>
          </form>

          {etiquetasInfo.length === 0 ? (
            <p className="text-[13px] text-black/40">Nenhuma etiqueta informativa para este produto.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {etiquetasInfo.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 text-[14px]">
                  <span>
                    {e.label} {!e.ativo && <span className="text-black/40">(inativa)</span>}
                  </span>
                  <form action={excluirEtiquetaInfoAction.bind(null, e.id)}>
                    <button type="submit" className="underline text-[var(--color-brand)] text-[13px]">
                      Remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
