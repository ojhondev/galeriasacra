import { listarEtiquetas, listarEtiquetasInfo } from "@/lib/etiquetas";
import { listarProdutosAdmin } from "@/lib/products";
import {
  criarEtiquetaAction,
  excluirEtiquetaAction,
  criarEtiquetaInfoAction,
  excluirEtiquetaInfoAction,
} from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminEtiquetasPage() {
  const [etiquetas, etiquetasInfo, produtos] = await Promise.all([
    listarEtiquetas(),
    listarEtiquetasInfo(),
    listarProdutosAdmin(),
  ]);

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Etiquetas de desconto</h1>

      <form
        action={criarEtiquetaAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Label</span>
          <input
            name="label"
            required
            placeholder="Ex: BLACK FRIDAY"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Tipo</span>
          <select name="tipo" className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent">
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
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[120px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Produto (opcional)</span>
          <select
            name="produtoId"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
          >
            <option value="">Todos os produtos</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 pb-2">
          <input type="checkbox" name="ativo" defaultChecked />
          <span className="text-[13px] text-black/50">Ativa</span>
        </label>

        <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
          Adicionar
        </button>
      </form>

      <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden mb-[48px]">
        {etiquetas.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhuma etiqueta de desconto.</p>
        ) : (
          etiquetas.map((etiqueta) => (
            <div
              key={etiqueta.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div>
                <p className="text-[15px]">
                  {etiqueta.label} {!etiqueta.ativo && <span className="text-black/40">(inativa)</span>}
                </p>
                <p className="text-[13px] text-black/50">
                  {etiqueta.tipo === "percentual" ? `${etiqueta.valor}%` : `R$ ${etiqueta.valor}`} ·{" "}
                  {etiqueta.produto?.nome ?? "Todos os produtos"}
                </p>
              </div>
              <form action={excluirEtiquetaAction.bind(null, etiqueta.id)}>
                <button type="submit" className="underline text-[var(--color-brand)] text-[13px]">
                  Excluir
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      <h1 className="text-[28px] mb-2">Etiquetas informativas</h1>
      <p className="text-[14px] text-black/50 mb-[24px] max-w-2xl">
        Selos exibidos nos cards de produto (entrega, estoque, novidade etc.), sem afetar o preço.
      </p>

      <form
        action={criarEtiquetaInfoAction}
        className="bg-white border border-black/10 rounded-[6px] p-5 flex flex-wrap items-end gap-4 mb-6"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Label</span>
          <input
            name="label"
            required
            placeholder="Ex: CHEGA EM ATÉ 7 DIAS"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[260px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[13px] text-black/50">Produto (opcional)</span>
          <select
            name="produtoId"
            className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
          >
            <option value="">Todos os produtos</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
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
        {etiquetasInfo.length === 0 ? (
          <p className="px-5 py-6 text-[14px] text-black/50">Nenhuma etiqueta informativa.</p>
        ) : (
          etiquetasInfo.map((etiqueta) => (
            <div
              key={etiqueta.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4"
            >
              <div>
                <p className="text-[15px]">
                  {etiqueta.label} {!etiqueta.ativo && <span className="text-black/40">(inativa)</span>}
                </p>
                <p className="text-[13px] text-black/50">{etiqueta.produto?.nome ?? "Todos os produtos"}</p>
              </div>
              <form action={excluirEtiquetaInfoAction.bind(null, etiqueta.id)}>
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
