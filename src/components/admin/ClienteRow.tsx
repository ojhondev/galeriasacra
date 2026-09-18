"use client";

import { useState } from "react";
import { atualizarClienteAction } from "@/lib/clientes-actions";

type Cliente = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string | null;
  role: "cliente" | "admin";
  createdAt: Date;
};

export function ClienteRow({ cliente }: { cliente: Cliente }) {
  const [editando, setEditando] = useState(false);

  if (!editando) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4">
        <div>
          <p className="text-[15px]">
            {cliente.nome}{" "}
            {cliente.role === "admin" && (
              <span className="text-[11px] text-white bg-black px-2 py-0.5 rounded-[6px] ml-1">admin</span>
            )}
          </p>
          <p className="text-[13px] text-black/50">
            {cliente.email} {cliente.whatsapp && `· ${cliente.whatsapp}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[13px] text-black/40">{new Date(cliente.createdAt).toLocaleDateString("pt-BR")}</p>
          <button type="button" onClick={() => setEditando(true)} className="underline text-[13px]">
            Editar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={atualizarClienteAction.bind(null, cliente.id)}
      className="border-b border-black/10 last:border-0 px-5 py-4 flex flex-wrap items-end gap-4"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Nome</span>
        <input
          name="nome"
          defaultValue={cliente.nome}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[200px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">WhatsApp</span>
        <input
          name="whatsapp"
          defaultValue={cliente.whatsapp ?? ""}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[160px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Papel</span>
        <select
          name="role"
          defaultValue={cliente.role}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <p className="text-[13px] text-black/40">{cliente.email} (não editável)</p>

      <button type="submit" className="bg-black text-white px-5 py-2.5 text-[14px] rounded-[6px]">
        Salvar
      </button>
      <button type="button" onClick={() => setEditando(false)} className="underline text-[13px]">
        Cancelar
      </button>
    </form>
  );
}
