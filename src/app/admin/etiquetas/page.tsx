import { listarEtiquetas } from "@/lib/etiquetas";
import { listarProdutosAdmin } from "@/lib/products";
import { criarEtiquetaAction, excluirEtiquetaAction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminEtiquetasPage() {
  const [etiquetas, produtos] = await Promise.all([listarEtiquetas(), listarProdutosAdmin()]);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Etiquetas de Desconto</h1>

      <form action={criarEtiquetaAction} className="flex flex-wrap items-end gap-4 mb-[42px] max-w-3xl">
        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">LABEL</span>
          <input
            name="label"
            required
            placeholder="Ex: BLACK FRIDAY"
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">TIPO</span>
          <select name="tipo" className="border-b border-black py-2 text-[18px] outline-none bg-transparent">
            <option value="percentual">% Percentual</option>
            <option value="fixo">R$ Fixo</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">VALOR</span>
          <input
            type="number"
            name="valor"
            required
            min={0}
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent w-[120px]"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[16px] tracking-artu">PRODUTO (opcional)</span>
          <select
            name="produtoId"
            className="border-b border-black py-2 text-[18px] outline-none bg-transparent min-w-[200px]"
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
          <span className="text-[16px] tracking-artu">ATIVA</span>
        </label>

        <button type="submit" className="bg-black text-white px-6 py-3 text-[16px] tracking-artu">
          ADICIONAR
        </button>
      </form>

      <div className="flex flex-col">
        {etiquetas.map((etiqueta) => (
          <div
            key={etiqueta.id}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-black py-[17px]"
          >
            <div>
              <p className="text-[18px]">
                {etiqueta.label} {!etiqueta.ativo && <span className="text-black/40">(inativa)</span>}
              </p>
              <p className="text-[14px] text-black/50">
                {etiqueta.tipo === "percentual" ? `${etiqueta.valor}%` : `R$ ${etiqueta.valor}`} ·{" "}
                {etiqueta.produto?.nome ?? "Todos os produtos"}
              </p>
            </div>
            <form action={excluirEtiquetaAction.bind(null, etiqueta.id)}>
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
