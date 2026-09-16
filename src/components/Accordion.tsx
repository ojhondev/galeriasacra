"use client";

import { useState, type ReactNode } from "react";

export function Accordion({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="border-t border-black">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between py-[17px] text-[18px] tracking-artu text-left"
        aria-expanded={aberto}
      >
        {titulo}
        <span aria-hidden="true">{aberto ? "−" : "+"}</span>
      </button>
      {aberto && <div className="pb-[17px] text-[16px] leading-[1.3]">{children}</div>}
    </div>
  );
}
