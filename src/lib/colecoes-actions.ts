"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { colecoes } from "@/db/schema";
import { obterSessao } from "@/lib/session";

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidarColecoes() {
  revalidatePath("/");
  revalidatePath("/quadros");
  revalidatePath("/admin/colecoes");
  revalidatePath("/admin/produtos/novo");
  revalidatePath("/admin/produtos/[id]", "page");
}

export async function criarColecaoAction(formData: FormData) {
  await exigirAdmin();
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  await db.insert(colecoes).values({
    nome,
    slug: gerarSlug(nome),
    imagemUrl: String(formData.get("imagemUrl") ?? "").trim() || "/categorias/teste-generico.jpg",
    ordem: Math.round(Number(formData.get("ordem") ?? 0)),
    ativo: formData.get("ativo") === "on",
  });
  revalidarColecoes();
  redirect("/admin/colecoes");
}

export async function atualizarColecaoAction(id: string, formData: FormData) {
  await exigirAdmin();
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  await db
    .update(colecoes)
    .set({
      nome,
      imagemUrl: String(formData.get("imagemUrl") ?? "").trim() || "/categorias/teste-generico.jpg",
      ordem: Math.round(Number(formData.get("ordem") ?? 0)),
      ativo: formData.get("ativo") === "on",
    })
    .where(eq(colecoes.id, id));
  revalidarColecoes();
  redirect("/admin/colecoes");
}

export async function excluirColecaoAction(id: string) {
  await exigirAdmin();
  await db.delete(colecoes).where(eq(colecoes.id, id));
  revalidarColecoes();
  redirect("/admin/colecoes");
}
