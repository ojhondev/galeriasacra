"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { etiquetasDesconto, etiquetasInfo, avaliacoes } from "@/db/schema";
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
    ativo: formData.get("status") === "ativo",
    ordem: Math.round(Number(formData.get("ordem") ?? 0)),
    estoque: Math.max(0, Math.round(Number(formData.get("estoque") ?? 0))),
    prazoEntregaDias: Math.max(1, Math.round(Number(formData.get("prazoEntregaDias") ?? 4))),
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

export async function criarEtiquetaInfoAction(formData: FormData) {
  await exigirAdmin();
  const produtoId = String(formData.get("produtoId") ?? "").trim();
  await db.insert(etiquetasInfo).values({
    produtoId: produtoId || null,
    label: String(formData.get("label") ?? "").trim(),
    ativo: formData.get("ativo") === "on",
  });
  revalidarCatalogo();
  redirect("/admin/etiquetas");
}

export async function excluirEtiquetaInfoAction(id: string) {
  await exigirAdmin();
  await db.delete(etiquetasInfo).where(eq(etiquetasInfo.id, id));
  revalidarCatalogo();
  redirect("/admin/etiquetas");
}

export async function criarAvaliacaoAction(formData: FormData) {
  await exigirAdmin();
  await db.insert(avaliacoes).values({
    produtoId: String(formData.get("produtoId") ?? "").trim(),
    nomeCliente: String(formData.get("nomeCliente") ?? "").trim(),
    nota: Math.min(5, Math.max(1, Math.round(Number(formData.get("nota") ?? 5)))),
    comentario: String(formData.get("comentario") ?? "").trim(),
  });
  revalidarCatalogo();
  redirect("/admin/avaliacoes");
}

export async function excluirAvaliacaoAction(id: string) {
  await exigirAdmin();
  await db.delete(avaliacoes).where(eq(avaliacoes.id, id));
  revalidarCatalogo();
  redirect("/admin/avaliacoes");
}
