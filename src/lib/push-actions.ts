"use server";

import { salvarInscricao, atualizarProdutoVisto } from "@/lib/push";

type SubscriptionJSON = { endpoint: string; keys: { p256dh: string; auth: string } };

export async function inscreverPush(
  subscription: SubscriptionJSON,
  produtoVisto: { nome: string; slug: string } | null,
) {
  await salvarInscricao(subscription, produtoVisto);
}

export async function atualizarProdutoVistoPush(
  endpoint: string,
  produtoVisto: { nome: string; slug: string },
) {
  await atualizarProdutoVisto(endpoint, produtoVisto);
}
