import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { solicitacoesRestauro, statusRestauroEnum } from "@/db/schema";

export async function listarSolicitacoesRestauro() {
  return db.query.solicitacoesRestauro.findMany({ orderBy: [desc(solicitacoesRestauro.createdAt)] });
}

export async function atualizarStatusRestauro(
  id: string,
  status: (typeof statusRestauroEnum.enumValues)[number],
) {
  await db.update(solicitacoesRestauro).set({ status }).where(eq(solicitacoesRestauro.id, id));
}
