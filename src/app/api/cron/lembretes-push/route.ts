import { NextResponse } from "next/server";
import webpush from "web-push";
import { listarInscricoesParaNotificar, marcarNotificado, removerInscricao } from "@/lib/push";

const MINUTOS_INATIVIDADE = 20;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    "mailto:contato@galeriasacra.com.br",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  const inscricoes = await listarInscricoesParaNotificar(MINUTOS_INATIVIDADE);
  let enviados = 0;

  for (const inscricao of inscricoes) {
    const nome = inscricao.usuario?.nome;
    const produto = inscricao.produtoVistoNome ?? "o quadro que você viu";
    const titulo = nome ? `${nome}, seu quadro está te esperando` : "Não esqueça do seu quadro";
    const corpo = `Finalize a compra de "${produto}" antes que o estoque acabe.`;
    const url = inscricao.produtoVistoSlug ? `/quadros/${inscricao.produtoVistoSlug}` : "/";

    try {
      await webpush.sendNotification(
        { endpoint: inscricao.endpoint, keys: { p256dh: inscricao.p256dh, auth: inscricao.auth } },
        JSON.stringify({ titulo, corpo, url }),
      );
      await marcarNotificado(inscricao.id);
      enviados++;
    } catch (erro: unknown) {
      const statusCode = (erro as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await removerInscricao(inscricao.endpoint);
      }
    }
  }

  return NextResponse.json({ enviados, total: inscricoes.length });
}
