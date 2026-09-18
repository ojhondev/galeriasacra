"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { obterSessao } from "@/lib/session";

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

export async function atualizarClienteAction(id: string, formData: FormData) {
  await exigirAdmin();
  await db
    .update(usuarios)
    .set({
      nome: String(formData.get("nome") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      role: formData.get("role") === "admin" ? "admin" : "cliente",
    })
    .where(eq(usuarios.id, id));
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}
