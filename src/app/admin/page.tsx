import Link from "next/link";
import { listarProdutosAdmin } from "@/lib/products";
import { listarPedidos, obterMetricasPedidos } from "@/lib/pedidos";
import { listarTodasAvaliacoes, calcularMedia } from "@/lib/avaliacoes";
import { listarEtiquetasAtivas } from "@/lib/etiquetas";
import { formatarPreco } from "@/lib/pricing";
import { STATUS_LABEL } from "@/lib/pedidos-shared";

export const dynamic = "force-dynamic";

const ESTOQUE_BAIXO_LIMITE = 5;

export default async function AdminPage() {
  const [produtos, metricas, pedidosRecentes, avaliacoes, etiquetasAtivas] = await Promise.all([
    listarProdutosAdmin(),
    obterMetricasPedidos(),
    listarPedidos(),
    listarTodasAvaliacoes(),
    listarEtiquetasAtivas(),
  ]);

  const produtosAtivos = produtos.filter((p) => p.ativo);
  const estoqueBaixo = produtos
    .filter((p) => p.ativo && p.estoque <= ESTOQUE_BAIXO_LIMITE)
    .sort((a, b) => a.estoque - b.estoque);
  const mediaAvaliacoes = calcularMedia(avaliacoes);
  const ultimosPedidos = pedidosRecentes.slice(0, 5);

  return (
    <div className="px-4 md:px-8 py-[32px] max-w-[1200px]">
      <h1 className="text-[28px] mb-[24px]">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-[32px]">
        <CardMetrica label="Receita total" valor={formatarPreco(metricas.receitaTotal)} />
        <CardMetrica label="Pedidos" valor={String(metricas.totalPedidos)} />
        <CardMetrica
          label="Aguardando pagamento"
          valor={String(metricas.pedidosAguardando)}
          destaque={metricas.pedidosAguardando > 0}
        />
        <CardMetrica label="Pedidos (7 dias)" valor={String(metricas.pedidosUltimos7Dias)} />
        <CardMetrica label="Produtos ativos" valor={String(produtosAtivos.length)} />
        <CardMetrica
          label="Estoque baixo"
          valor={String(estoqueBaixo.length)}
          destaque={estoqueBaixo.length > 0}
        />
        <CardMetrica label="Etiquetas ativas" valor={String(etiquetasAtivas.length)} />
        <CardMetrica
          label="Avaliação média"
          valor={avaliacoes.length > 0 ? `${mediaAvaliacoes.toFixed(1)} (${avaliacoes.length})` : "—"}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/10 rounded-[6px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
            <p className="text-[16px] font-medium">Pedidos recentes</p>
            <Link href="/admin/pedidos" className="text-[13px] underline">
              Ver todos
            </Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-black/50">Nenhum pedido ainda.</p>
          ) : (
            <div className="flex flex-col">
              {ultimosPedidos.map((pedido) => (
                <Link
                  key={pedido.id}
                  href="/admin/pedidos"
                  className="flex items-center justify-between gap-4 px-5 py-3 border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-[14px]">{pedido.numero}</p>
                    <p className="text-[12px] text-black/50">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                      {STATUS_LABEL[pedido.status]}
                    </p>
                  </div>
                  <p className="text-[14px] shrink-0">{formatarPreco(pedido.total)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-black/10 rounded-[6px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
            <p className="text-[16px] font-medium">Estoque baixo</p>
            <Link href="/admin/produtos" className="text-[13px] underline">
              Ver produtos
            </Link>
          </div>
          {estoqueBaixo.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-black/50">
              Nenhum produto com estoque baixo (≤ {ESTOQUE_BAIXO_LIMITE}).
            </p>
          ) : (
            <div className="flex flex-col">
              {estoqueBaixo.map((produto) => (
                <Link
                  key={produto.id}
                  href={`/admin/produtos/${produto.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-3 border-b border-black/5 last:border-0 hover:bg-black/[0.02]"
                >
                  <p className="text-[14px]">{produto.nome}</p>
                  <p className="text-[14px] text-[var(--color-brand)] shrink-0">
                    {produto.estoque} un.
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardMetrica({
  label,
  valor,
  destaque = false,
}: {
  label: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div className="bg-white border border-black/10 rounded-[6px] px-5 py-4">
      <p className="text-[13px] text-black/50 mb-1">{label}</p>
      <p className={`text-[24px] ${destaque ? "text-[var(--color-brand)]" : ""}`}>{valor}</p>
    </div>
  );
}
