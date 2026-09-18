"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { solicitacoesRestauro, statusRestauroEnum } from "@/db/schema";
import { obterSessao } from "@/lib/session";
import { atualizarStatusRestauro } from "@/lib/restauro";

export type DadosSolicitacaoRestauro = {
  nome: string;
  email: string;
  whatsapp: string;
  tipoObra: string;
  largura: number | null;
  altura: number | null;
  tiposDano: string[];
  descricao: string;
  urgencia: string;
  quantidadeFotos: number;
};

export async function criarSolicitacaoRestauro(dados: DadosSolicitacaoRestauro): Promise<string> {
  const numero = `RT-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(solicitacoesRestauro).values({ numero, ...dados });
  revalidatePath("/admin");
  revalidatePath("/admin/restauros");
  return numero;
}

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

export async function atualizarStatusRestauroAction(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as (typeof statusRestauroEnum.enumValues)[number];
  if (!id || !statusRestauroEnum.enumValues.includes(status)) return;

  await atualizarStatusRestauro(id, status);
  revalidatePath("/admin/restauros");
  revalidatePath("/admin");
  redirect("/admin/restauros");
}
