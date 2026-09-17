import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { avaliacoes } from "@/db/schema";
import type { Avaliacao } from "@/lib/avaliacoes-shared";

export type { Avaliacao } from "@/lib/avaliacoes-shared";
export { calcularMedia } from "@/lib/avaliacoes-shared";

export async function listarAvaliacoesPorProduto(produtoId: string): Promise<Avaliacao[]> {
  return db.query.avaliacoes.findMany({
    where: eq(avaliacoes.produtoId, produtoId),
    orderBy: [desc(avaliacoes.createdAt)],
  });
}

export async function listarTodasAvaliacoes() {
  return db.query.avaliacoes.findMany({
    orderBy: [desc(avaliacoes.createdAt)],
    with: { produto: true },
  });
}
