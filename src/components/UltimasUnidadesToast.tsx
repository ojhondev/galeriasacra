"use client";

import { useEffect, useState } from "react";

export function UltimasUnidadesToast({ estoque }: { estoque: number }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisivel(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visivel) return null;

  return (
    <div className="fixed bottom-[100px] lg:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[320px] z-30 bg-black text-white px-5 py-4 flex items-start gap-3 shadow-lg">
      <span aria-hidden="true">🔥</span>
      <div className="flex-1">
        <p className="text-[14px] font-medium">Últimas Unidades</p>
        <p className="text-[13px] text-white/70 mt-1">
          Restam apenas {estoque} {estoque === 1 ? "unidade" : "unidades"} deste quadro em estoque
          físico.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setVisivel(false)}
        aria-label="Fechar aviso"
        className="text-white/60 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
