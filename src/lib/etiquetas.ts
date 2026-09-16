import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { etiquetasDesconto } from "@/db/schema";

export async function listarEtiquetas() {
  return db.query.etiquetasDesconto.findMany({
    orderBy: [desc(etiquetasDesconto.createdAt)],
    with: { produto: true },
  });
}
