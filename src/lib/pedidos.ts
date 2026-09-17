import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { pedidos, statusPedidoEnum } from "@/db/schema";

export async function listarPedidos() {
  return db.query.pedidos.findMany({ orderBy: [desc(pedidos.createdAt)] });
}

export async function obterMetricasPedidos() {
  const [linha] = await db
    .select({
      totalPedidos: sql<number>`count(*)`.mapWith(Number),
      receitaTotal: sql<number>`coalesce(sum(${pedidos.total}) filter (where ${pedidos.status} != 'cancelado'), 0)`.mapWith(
        Number,
      ),
      pedidosAguardando: sql<number>`count(*) filter (where ${pedidos.status} = 'aguardando_pagamento')`.mapWith(
        Number,
      ),
      pedidosUltimos7Dias: sql<number>`count(*) filter (where ${pedidos.createdAt} >= now() - interval '7 days')`.mapWith(
        Number,
      ),
    })
    .from(pedidos);

  return linha;
}

export async function atualizarStatusPedido(id: string, status: (typeof statusPedidoEnum.enumValues)[number]) {
  await db.update(pedidos).set({ status }).where(eq(pedidos.id, id));
}
