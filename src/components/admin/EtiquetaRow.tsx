"use client";

import { useState } from "react";
import { atualizarEtiquetaAction, excluirEtiquetaAction } from "@/lib/admin-actions";

type Etiqueta = {
  id: string;
  label: string;
  tipo: "percentual" | "fixo";
  valor: number;
  ativo: boolean;
  produtoId: string | null;
  produto: { nome: string } | null;
};

export function EtiquetaRow({ etiqueta, produtos }: { etiqueta: Etiqueta; produtos: { id: string; nome: string }[] }) {
  const [editando, setEditando] = useState(false);

  if (!editando) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4">
        <div>
          <p className="text-[15px]">
            {etiqueta.label} {!etiqueta.ativo && <span className="text-black/40">(inativa)</span>}
          </p>
          <p className="text-[13px] text-black/50">
            {etiqueta.tipo === "percentual" ? `${etiqueta.valor}%` : `R$ ${etiqueta.valor}`} ·{" "}
            {etiqueta.produto?.nome ?? "Todos os produtos"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditando(true)} className="underline text-[13px]">
            Editar
          </button>
          <form action={excluirEtiquetaAction.bind(null, etiqueta.id)}>
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
      action={atualizarEtiquetaAction.bind(null, etiqueta.id)}
      className="border-b border-black/10 last:border-0 px-5 py-4 flex flex-wrap items-end gap-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Label</span>
        <input
          name="label"
          defaultValue={etiqueta.label}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Tipo</span>
        <select
          name="tipo"
          defaultValue={etiqueta.tipo}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
        >
          <option value="percentual">% Percentual</option>
          <option value="fixo">R$ Fixo</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Valor</span>
        <input
          type="number"
          name="valor"
          defaultValue={etiqueta.valor}
          required
          min={0}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[120px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Produto (opcional)</span>
        <select
          name="produtoId"
          defaultValue={etiqueta.produtoId ?? ""}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
        >
          <option value="">Todos os produtos</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 pb-2">
        <input type="checkbox" name="ativo" defaultChecked={etiqueta.ativo} />
        <span className="text-[13px] text-black/50">Ativa</span>
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
