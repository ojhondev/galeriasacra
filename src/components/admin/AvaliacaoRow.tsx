"use client";

import { useState } from "react";
import { atualizarAvaliacaoAction, excluirAvaliacaoAction } from "@/lib/admin-actions";

type Avaliacao = {
  id: string;
  nomeCliente: string;
  nota: number;
  comentario: string;
  produto: { nome: string } | null;
};

export function AvaliacaoRow({ avaliacao }: { avaliacao: Avaliacao }) {
  const [editando, setEditando] = useState(false);

  if (!editando) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4">
        <div>
          <p className="text-[15px]">
            {"★".repeat(avaliacao.nota)}
            {"☆".repeat(5 - avaliacao.nota)} — {avaliacao.nomeCliente}
          </p>
          <p className="text-[13px] text-black/50">
            {avaliacao.produto?.nome} · {avaliacao.comentario}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditando(true)} className="underline text-[13px]">
            Editar
          </button>
          <form action={excluirAvaliacaoAction.bind(null, avaliacao.id)}>
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
      action={atualizarAvaliacaoAction.bind(null, avaliacao.id)}
      className="border-b border-black/10 last:border-0 px-5 py-4 flex flex-wrap items-end gap-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Cliente</span>
        <input
          name="nomeCliente"
          defaultValue={avaliacao.nomeCliente}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Nota (1-5)</span>
        <input
          type="number"
          name="nota"
          defaultValue={avaliacao.nota}
          required
          min={1}
          max={5}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[80px]"
        />
      </label>

      <label className="flex flex-col gap-1 flex-1 min-w-[240px]">
        <span className="text-[13px] text-black/50">Comentário</span>
        <input
          name="comentario"
          defaultValue={avaliacao.comentario}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
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
