"use client";

import { useEffect, useState } from "react";
import { IconClose } from "@/components/icons";

const STORAGE_KEY = "galeriasacra:announcement-fechado";

export function AnnouncementBar({ children }: { children: React.ReactNode }) {
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
      className="relative text-white text-center text-[13px] tracking-artu py-[10px] px-10 rounded-none"
      style={{ background: "var(--color-brand)" }}
    >
      {children}
      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar aviso"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
      >
        <IconClose />
      </button>
    </div>
  );
}
