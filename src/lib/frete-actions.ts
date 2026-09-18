"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { faixasFrete, lojaConfig } from "@/db/schema";
import { obterSessao } from "@/lib/session";
import { calcularFrete } from "@/lib/frete";

export async function calcularFreteAction(cep: string) {
  return calcularFrete(cep);
}

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

function revalidarFrete() {
  revalidatePath("/");
  revalidatePath("/quadros/[slug]", "page");
  revalidatePath("/admin/frete");
}

export async function criarFaixaFreteAction(formData: FormData) {
  await exigirAdmin();
  const prefixoCep = String(formData.get("prefixoCep") ?? "").trim();
  if (!/^[0-9]$/.test(prefixoCep)) return;

  await db
    .insert(faixasFrete)
    .values({
      prefixoCep,
      regiao: String(formData.get("regiao") ?? "").trim(),
      prazo: String(formData.get("prazo") ?? "").trim(),
      valor: Math.max(0, Math.round(Number(formData.get("valor") ?? 0))),
    })
    .onConflictDoUpdate({
      target: faixasFrete.prefixoCep,
      set: {
        regiao: String(formData.get("regiao") ?? "").trim(),
        prazo: String(formData.get("prazo") ?? "").trim(),
        valor: Math.max(0, Math.round(Number(formData.get("valor") ?? 0))),
      },
    });
  revalidarFrete();
  redirect("/admin/frete");
}

export async function excluirFaixaFreteAction(id: string) {
  await exigirAdmin();
  await db.delete(faixasFrete).where(eq(faixasFrete.id, id));
  revalidarFrete();
  redirect("/admin/frete");
}

export async function atualizarConfigFreteAction(formData: FormData) {
  await exigirAdmin();
  const freteGratisMinimo = Math.max(0, Math.round(Number(formData.get("freteGratisMinimo") ?? 400)));

  await db
    .insert(lojaConfig)
    .values({ id: "default", freteGratisMinimo })
    .onConflictDoUpdate({ target: lojaConfig.id, set: { freteGratisMinimo } });
  revalidarFrete();
  redirect("/admin/frete");
}
