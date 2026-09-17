import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { etiquetasDesconto, etiquetasInfo } from "@/db/schema";

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

export async function listarEtiquetasInfo() {
  return db.query.etiquetasInfo.findMany({
    orderBy: [desc(etiquetasInfo.createdAt)],
    with: { produto: true },
  });
}

export async function listarEtiquetasInfoAtivas() {
  return db.query.etiquetasInfo.findMany({
    where: eq(etiquetasInfo.ativo, true),
    orderBy: [desc(etiquetasInfo.createdAt)],
    with: { produto: true },
  });
}
