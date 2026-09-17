"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { obterProdutoVisto } from "@/lib/produto-visto";
import { inscreverPush, atualizarProdutoVistoPush } from "@/lib/push-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PROMPT_FECHADO_KEY = "galeriasacra:push-prompt-fechado";
const ATRASO_PROMPT_MS = 4000;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushNotificationManager() {
  const pathname = usePathname();
  const [mostrarPrompt, setMostrarPrompt] = useState(false);
  const ultimoSincronizadoRef = useRef<string | null>(null);

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY || typeof Notification === "undefined") return;
    if (Notification.permission !== "default") return;
    try {
      if (window.sessionStorage.getItem(PROMPT_FECHADO_KEY) === "1") return;
    } catch {
      // ignora storage indisponível
    }
    if (!obterProdutoVisto()) return;

    const timer = setTimeout(() => setMostrarPrompt(true), ATRASO_PROMPT_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY || typeof Notification === "undefined") return;
    if (Notification.permission !== "granted" || !("serviceWorker" in navigator)) return;

    async function sincronizar() {
      const produto = obterProdutoVisto();
      if (!produto || ultimoSincronizadoRef.current === produto.slug) return;

      const registro = await navigator.serviceWorker.ready;
      const inscricao = await registro.pushManager.getSubscription();
      if (!inscricao) return;

      ultimoSincronizadoRef.current = produto.slug;
      await atualizarProdutoVistoPush(inscricao.endpoint, produto);
    }

    sincronizar().catch(() => {});
  }, [pathname]);

  function fecharPrompt() {
    setMostrarPrompt(false);
    try {
      window.sessionStorage.setItem(PROMPT_FECHADO_KEY, "1");
    } catch {
      // ignora storage indisponível
    }
  }

  async function ativarNotificacoes() {
    fecharPrompt();
    if (!VAPID_PUBLIC_KEY) return;

    const permissao = await Notification.requestPermission();
    if (permissao !== "granted") return;

    const registro = await navigator.serviceWorker.ready;
    let inscricao = await registro.pushManager.getSubscription();
    if (!inscricao) {
      inscricao = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const produto = obterProdutoVisto();
    ultimoSincronizadoRef.current = produto?.slug ?? null;
    await inscreverPush(inscricao.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } }, produto);
  }

  if (!mostrarPrompt) return null;

  return (
    <div className="fixed bottom-[152px] md:bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-[340px] z-40 bg-white border border-black/10 shadow-lg rounded-[6px] p-4">
      <p className="text-[14px] mb-3">
        Ativar notificações para não perder o quadro que você estava vendo?
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={ativarNotificacoes}
          className="bg-black text-white px-4 py-2 text-[13px] rounded-[6px]"
        >
          Ativar
        </button>
        <button type="button" onClick={fecharPrompt} className="text-[13px] underline">
          Agora não
        </button>
      </div>
    </div>
  );
}
