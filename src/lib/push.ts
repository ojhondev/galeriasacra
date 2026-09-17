import "server-only";
import { eq, isNull, isNotNull, lt, and } from "drizzle-orm";
import { db } from "@/db";
import { pushInscricoes } from "@/db/schema";
import { obterSessao } from "@/lib/session";

type SubscriptionJSON = { endpoint: string; keys: { p256dh: string; auth: string } };
type ProdutoVistoInput = { nome: string; slug: string } | null;

export async function salvarInscricao(subscription: SubscriptionJSON, produtoVisto: ProdutoVistoInput) {
  const sessao = await obterSessao();

  await db
    .insert(pushInscricoes)
    .values({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      usuarioId: sessao?.userId ?? null,
      produtoVistoNome: produtoVisto?.nome ?? null,
      produtoVistoSlug: produtoVisto?.slug ?? null,
    })
    .onConflictDoUpdate({
      target: pushInscricoes.endpoint,
      set: {
        usuarioId: sessao?.userId ?? null,
        produtoVistoNome: produtoVisto?.nome ?? null,
        produtoVistoSlug: produtoVisto?.slug ?? null,
        notificadoEm: null,
        updatedAt: new Date(),
      },
    });
}

export async function atualizarProdutoVisto(endpoint: string, produtoVisto: { nome: string; slug: string }) {
  await db
    .update(pushInscricoes)
    .set({
      produtoVistoNome: produtoVisto.nome,
      produtoVistoSlug: produtoVisto.slug,
      notificadoEm: null,
      updatedAt: new Date(),
    })
    .where(eq(pushInscricoes.endpoint, endpoint));
}

export async function listarInscricoesParaNotificar(minutosInatividade: number) {
  const limite = new Date(Date.now() - minutosInatividade * 60 * 1000);
  return db.query.pushInscricoes.findMany({
    where: and(
      isNotNull(pushInscricoes.produtoVistoSlug),
      isNull(pushInscricoes.notificadoEm),
      lt(pushInscricoes.updatedAt, limite),
    ),
    with: { usuario: true },
  });
}

export async function marcarNotificado(id: string) {
  await db.update(pushInscricoes).set({ notificadoEm: new Date() }).where(eq(pushInscricoes.id, id));
}

export async function removerInscricao(endpoint: string) {
  await db.delete(pushInscricoes).where(eq(pushInscricoes.endpoint, endpoint));
}
