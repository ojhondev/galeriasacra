"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { etiquetasDesconto } from "@/db/schema";
import {
  criarProduto,
  atualizarProduto,
  excluirProduto,
  type ProdutoInput,
  type Orientacao,
} from "@/lib/products";
import { obterSessao } from "@/lib/session";

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

function lerProdutoForm(formData: FormData): ProdutoInput {
  return {
    sku: String(formData.get("sku") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    nome: String(formData.get("nome") ?? "").trim(),
    categoria: String(formData.get("categoria") ?? "").trim(),
    descricaoCurta: String(formData.get("descricaoCurta") ?? "").trim(),
    descricaoLonga: String(formData.get("descricaoLonga") ?? "")
      .split("\n")
      .map((linha) => linha.trim())
      .filter(Boolean),
    precoBase: Math.round(Number(formData.get("precoBase") ?? 0)),
    orientacao: (formData.get("orientacao") as Orientacao) ?? "retrato",
    hue: Math.round(Number(formData.get("hue") ?? 200)),
    ativo: formData.get("ativo") === "on",
  };
}

function revalidarCatalogo() {
  revalidatePath("/");
  revalidatePath("/quadros");
  revalidatePath("/monte-seu-quadro");
  revalidatePath("/quadros/[slug]", "page");
}

export async function criarProdutoAction(formData: FormData) {
  await exigirAdmin();
  await criarProduto(lerProdutoForm(formData));
  revalidarCatalogo();
  redirect("/admin/produtos");
}

export async function atualizarProdutoAction(id: string, formData: FormData) {
  await exigirAdmin();
  await atualizarProduto(id, lerProdutoForm(formData));
  revalidarCatalogo();
  redirect("/admin/produtos");
}

export async function excluirProdutoAction(id: string) {
  await exigirAdmin();
  await excluirProduto(id);
  revalidarCatalogo();
  redirect("/admin/produtos");
}

export async function criarEtiquetaAction(formData: FormData) {
  await exigirAdmin();
  const produtoId = String(formData.get("produtoId") ?? "").trim();
  await db.insert(etiquetasDesconto).values({
    produtoId: produtoId || null,
    label: String(formData.get("label") ?? "").trim(),
    tipo: (formData.get("tipo") as "percentual" | "fixo") ?? "percentual",
    valor: Math.round(Number(formData.get("valor") ?? 0)),
    ativo: formData.get("ativo") === "on",
  });
  revalidarCatalogo();
  redirect("/admin/etiquetas");
}

export async function excluirEtiquetaAction(id: string) {
  await exigirAdmin();
  await db.delete(etiquetasDesconto).where(eq(etiquetasDesconto.id, id));
  revalidarCatalogo();
  redirect("/admin/etiquetas");
}
