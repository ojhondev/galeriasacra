"use client";

import { useState } from "react";
import { atualizarFaixaFreteAction, excluirFaixaFreteAction } from "@/lib/frete-actions";
import { formatarPreco } from "@/lib/pricing";

type Faixa = {
  id: string;
  prefixoCep: string;
  regiao: string;
  prazo: string;
  valor: number;
};

export function FaixaFreteRow({ faixa }: { faixa: Faixa }) {
  const [editando, setEditando] = useState(false);

  if (!editando) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4">
        <div>
          <p className="text-[15px]">
            CEP {faixa.prefixoCep}xxx-xxx · {faixa.regiao}
          </p>
          <p className="text-[13px] text-black/50">
            {faixa.prazo} · {formatarPreco(faixa.valor)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditando(true)} className="underline text-[13px]">
            Editar
          </button>
          <form action={excluirFaixaFreteAction.bind(null, faixa.id)}>
            <button type="submit" className="underline text-[var(--color-brand)] text-[13px]">
              Excluir
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form
      action={atualizarFaixaFreteAction.bind(null, faixa.id)}
      className="border-b border-black/10 last:border-0 px-5 py-4 flex flex-wrap items-end gap-4"
    >
      <p className="text-[13px] text-black/40">CEP {faixa.prefixoCep}xxx-xxx (fixo)</p>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Região</span>
        <input
          name="regiao"
          defaultValue={faixa.regiao}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Prazo</span>
        <input
          name="prazo"
          defaultValue={faixa.prazo}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[160px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Valor (R$)</span>
        <input
          type="number"
          name="valor"
          defaultValue={faixa.valor}
          required
          min={0}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[120px]"
        />
      </label>

      <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
        Salvar
      </button>
      <button type="button" onClick={() => setEditando(false)} className="underline text-[13px]">
        Cancelar
      </button>
    </form>
  );
}
