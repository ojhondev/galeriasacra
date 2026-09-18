"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagemUpload } from "@/components/admin/ImagemUpload";
import { atualizarColecaoAction, excluirColecaoAction } from "@/lib/colecoes-actions";
import type { Colecao } from "@/lib/colecoes";

export function ColecaoRow({ colecao }: { colecao: Colecao }) {
  const [editando, setEditando] = useState(false);
  const [imagemUrl, setImagemUrl] = useState(colecao.imagemUrl);

  if (!editando) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 last:border-0 px-5 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={colecao.imagemUrl}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="w-10 h-10 rounded-[6px] object-cover shrink-0 bg-[#f2f2ef]"
          />
          <div>
            <p className="text-[15px]">
              {colecao.nome} {!colecao.ativo && <span className="text-black/40">(inativa)</span>}
            </p>
            <p className="text-[13px] text-black/50">Ordem {colecao.ordem}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setEditando(true)} className="underline text-[13px]">
            Editar
          </button>
          <form action={excluirColecaoAction.bind(null, colecao.id)}>
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
      action={atualizarColecaoAction.bind(null, colecao.id)}
      className="border-b border-black/10 last:border-0 px-5 py-4 flex flex-wrap items-end gap-4"
    >
      <div className="w-[100px] shrink-0">
        <ImagemUpload label="Imagem" value={imagemUrl} onChange={setImagemUrl} />
        <input type="hidden" name="imagemUrl" value={imagemUrl} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Nome</span>
        <input
          name="nome"
          defaultValue={colecao.nome}
          required
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent min-w-[220px]"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[13px] text-black/50">Ordem</span>
        <input
          type="number"
          name="ordem"
          defaultValue={colecao.ordem}
          className="border-b border-black/30 py-2 text-[15px] outline-none bg-transparent w-[100px]"
        />
      </label>

      <label className="flex items-center gap-2 pb-2">
        <input type="checkbox" name="ativo" defaultChecked={colecao.ativo} />
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
