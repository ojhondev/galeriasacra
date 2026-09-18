import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { colecoes } from "@/db/schema";

export type Colecao = typeof colecoes.$inferSelect;

export async function listarColecoes(): Promise<Colecao[]> {
  return db.query.colecoes.findMany({ orderBy: [asc(colecoes.ordem), asc(colecoes.nome)] });
}

export async function listarColecoesAtivas(): Promise<Colecao[]> {
  return db.query.colecoes.findMany({
    where: eq(colecoes.ativo, true),
    orderBy: [asc(colecoes.ordem), asc(colecoes.nome)],
  });
}
