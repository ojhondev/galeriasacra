"use client";

import { useState, type FormEvent } from "react";
import { formatarPreco } from "@/lib/pricing";
import { calcularFreteAction } from "@/lib/frete-actions";

function formatarCep(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

export function FreteCalculadora() {
  const [cep, setCep] = useState("");
  const [calculando, setCalculando] = useState(false);
  const [resultado, setResultado] = useState<{ regiao: string; prazo: string; valor: number } | null>(null);

  async function calcular(e: FormEvent) {
    e.preventDefault();
    const digitos = cep.replace(/\D/g, "");
    if (digitos.length !== 8) return;

    setCalculando(true);
    setResultado(null);
    const faixa = await calcularFreteAction(cep);
    setResultado(faixa);
    setCalculando(false);
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
