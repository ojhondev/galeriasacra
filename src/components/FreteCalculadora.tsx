"use client";

import { useState, type FormEvent } from "react";
import { formatarPreco } from "@/lib/pricing";

const FAIXAS_FRETE = [
  { prefixo: "0", regiao: "Grande São Paulo", prazo: "2 a 4 dias úteis", valor: 24 },
  { prefixo: "1", regiao: "Interior de São Paulo", prazo: "3 a 5 dias úteis", valor: 29 },
  { prefixo: "2", regiao: "Rio de Janeiro / Espírito Santo", prazo: "3 a 6 dias úteis", valor: 32 },
  { prefixo: "3", regiao: "Minas Gerais", prazo: "3 a 6 dias úteis", valor: 30 },
  { prefixo: "4", regiao: "Bahia / Sergipe", prazo: "4 a 8 dias úteis", valor: 38 },
  { prefixo: "5", regiao: "Nordeste", prazo: "5 a 9 dias úteis", valor: 42 },
  { prefixo: "6", regiao: "Norte", prazo: "6 a 12 dias úteis", valor: 55 },
  { prefixo: "7", regiao: "Centro-Oeste / Distrito Federal", prazo: "4 a 7 dias úteis", valor: 36 },
  { prefixo: "8", regiao: "Paraná / Santa Catarina", prazo: "3 a 6 dias úteis", valor: 32 },
  { prefixo: "9", regiao: "Rio Grande do Sul", prazo: "4 a 7 dias úteis", valor: 35 },
];

function formatarCep(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

export function FreteCalculadora() {
  const [cep, setCep] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<{ regiao: string; prazo: string; valor: number } | null>(null);

  function calcular(e: FormEvent) {
    e.preventDefault();
    const digitos = cep.replace(/\D/g, "");
    if (digitos.length !== 8) return;

    setCalculando(true);
    setResultado(null);
    setTimeout(() => {
      const faixa = FAIXAS_FRETE.find((f) => f.prefixo === digitos[0]) ?? FAIXAS_FRETE[0];
      setResultado(faixa);
      setCalculando(false);
    }, 600);
  }

  return (
    <div className="border-t border-black py-[17px]">
      <p className="text-[13px] text-black/60 mb-2">Calcular frete e prazo</p>
      <form onSubmit={calcular} className="flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(formatarCep(e.target.value))}
          placeholder="00000-000"
          inputMode="numeric"
          className="border border-black/30 px-3 py-2 text-[16px] flex-1 bg-transparent"
        />
        <button
          type="submit"
          disabled={calculando || cep.replace(/\D/g, "").length !== 8}
          className="border border-black px-4 py-2 text-[14px] rounded-[6px] disabled:opacity-40"
        >
          {calculando ? "..." : "Calcular"}
        </button>
      </form>
      {resultado && (
        <p className="text-[14px] mt-2 text-black/70">
          Estimativa para {resultado.regiao}: <strong>{resultado.prazo}</strong> ·{" "}
          {formatarPreco(resultado.valor)}
        </p>
      )}
    </div>
  );
}
