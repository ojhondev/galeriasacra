import { listarPedidos } from "@/lib/pedidos";
import { formatarPreco } from "@/lib/pricing";
import { atualizarStatusPedidoAction } from "@/lib/pedido-actions";
import { STATUS_PEDIDO, STATUS_LABEL, STATUS_COR } from "@/lib/pedidos-shared";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const pedidos = await listarPedidos();

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-[6px] px-5 py-8 text-center">
          <p className="text-[15px] text-black/50">
            Nenhum pedido ainda. Pedidos aparecem aqui assim que um cliente finaliza a compra pelo
            carrinho.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-[6px] overflow-hidden">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="border-b border-black/10 last:border-0 px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[16px]">{pedido.numero}</p>
                  <p className="text-[13px] text-black/50">
                    {new Date(pedido.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[12px] text-white px-2.5 py-1 rounded-[6px] shrink-0"
                    style={{ background: STATUS_COR[pedido.status] }}
                  >
                    {STATUS_LABEL[pedido.status]}
                  </span>
                  <p className="text-[18px] shrink-0">{formatarPreco(pedido.total)}</p>
                </div>
              </div>

              <ul className="text-[14px] text-black/70 mb-3 flex flex-col gap-0.5">
                {pedido.itens.map((item, i) => (
                  <li key={i}>
                    {item.quantidade}x {item.nome} ({item.tamanhoLabel}, {item.molduraLabel},{" "}
                    {item.materialLabel})
                  </li>
                ))}
              </ul>

              <form action={atualizarStatusPedidoAction} className="flex items-center gap-3">
                <input type="hidden" name="id" value={pedido.id} />
                <select
                  name="status"
                  defaultValue={pedido.status}
                  className="border border-black/20 rounded-[6px] px-3 py-1.5 text-[13px] bg-transparent outline-none"
                >
                  {STATUS_PEDIDO.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="border border-black px-4 py-1.5 text-[13px] rounded-[6px]"
                >
                  Atualizar
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
