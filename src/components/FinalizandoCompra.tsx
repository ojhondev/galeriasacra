"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FRASES = [
  "Preparando a arte...",
  "Selecionando a tela ideal...",
  "Enviando para o departamento de telas...",
  "Ajustando a moldura...",
  "Conferindo os últimos detalhes...",
  "Quase pronto...",
];

const INTERVALO_MS = 900;

export function FinalizandoCompra({ onConcluir }: { onConcluir: () => void }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((i) => Math.min(i + 1, FRASES.length - 1));
    }, INTERVALO_MS);

    const timeout = setTimeout(onConcluir, FRASES.length * INTERVALO_MS + 400);

    return () => {
      clearInterval(intervalo);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-4">
      <Image
        src="/logo-galeriasacra-vinho.png"
        alt="Galeria Sacra"
        width={765}
        height={406}
        className="h-[64px] w-auto mb-[42px] animate-[pulse-scale_1.4s_ease-in-out_infinite]"
      />
      <p className="text-[18px] tracking-artu text-center">{FRASES[indice]}</p>

      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
