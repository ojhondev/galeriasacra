"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "galeriasacra:aviso-whatsapp-fechado";

export function AvisoWhatsappBar() {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata a preferência de fechado salva no sessionStorage após o mount, precisa ocorrer depois do SSR
        setVisivel(false);
      }
    } catch {
      // ignora storage indisponível
    }
  }, []);

  if (!visivel) return null;

  function fechar() {
    setVisivel(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignora storage indisponível
    }
  }

  return (
    <div
      className="fixed bottom-16 md:bottom-0 inset-x-0 z-50 bg-white border-t border-black/10 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-center gap-3 md:gap-6 max-w-[1200px] mx-auto">
        <p className="text-[14px] text-black/70 text-center md:text-left leading-[1.4]">
          A Galeria Sacra está finalizando pedidos e pagamentos por WhatsApp. Ao finalizar sua
          compra você será redirecionado.
        </p>
        <button
          type="button"
          onClick={fechar}
          className="shrink-0 bg-black text-white px-6 py-2.5 text-[13px] tracking-artu rounded-[6px]"
        >
          ENTENDI
        </button>
      </div>
    </div>
  );
}
