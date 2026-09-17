"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { pedidos, statusPedidoEnum } from "@/db/schema";
import { obterSessao } from "@/lib/session";
import { atualizarStatusPedido } from "@/lib/pedidos";

type ItemPedido = {
  nome: string;
  tamanhoLabel: string;
  molduraLabel: string;
  materialLabel: string;
  quantidade: number;
  precoUnitario: number;
};

export async function criarPedido(itens: ItemPedido[], total: number): Promise<string> {
  const numero = `GS-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(pedidos).values({ numero, itens, total });
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  return numero;
}

async function exigirAdmin() {
  const sessao = await obterSessao();
  if (sessao?.role !== "admin") {
    throw new Error("Não autorizado.");
  }
}

export async function atualizarStatusPedidoAction(formData: FormData) {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as (typeof statusPedidoEnum.enumValues)[number];
  if (!id || !statusPedidoEnum.enumValues.includes(status)) return;

  await atualizarStatusPedido(id, status);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  redirect("/admin/pedidos");
}
