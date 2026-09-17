import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { etiquetasDesconto } from "@/db/schema";

export async function listarEtiquetas() {
  return db.query.etiquetasDesconto.findMany({
    orderBy: [desc(etiquetasDesconto.createdAt)],
    with: { produto: true },
  });
}

export async function listarEtiquetasAtivas() {
  return db.query.etiquetasDesconto.findMany({
    where: eq(etiquetasDesconto.ativo, true),
    orderBy: [desc(etiquetasDesconto.createdAt)],
    with: { produto: true },
  });
}
