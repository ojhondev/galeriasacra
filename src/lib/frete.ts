import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { faixasFrete, lojaConfig } from "@/db/schema";

export async function listarFaixasFrete() {
  return db.query.faixasFrete.findMany({ orderBy: [asc(faixasFrete.prefixoCep)] });
}

export async function obterConfigLoja() {
  const config = await db.query.lojaConfig.findFirst({ where: eq(lojaConfig.id, "default") });
  return config ?? { id: "default", freteGratisMinimo: 400 };
}

export async function calcularFrete(cep: string) {
  const digitos = cep.replace(/\D/g, "");
  if (digitos.length !== 8) return null;

  const faixas = await listarFaixasFrete();
  const faixa = faixas.find((f) => f.prefixoCep === digitos[0]) ?? faixas[0] ?? null;
  return faixa;
}
