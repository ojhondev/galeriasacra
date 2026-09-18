"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

export function ImagemUpload({
  label,
  value,
  onChange,
  corPreview,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  corPreview?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    setEnviando(true);
    setErro(null);
    try {
      const resultado = await upload(arquivo.name, arquivo, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      onChange(resultado.url);
    } catch {
      setErro("Falha no upload. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-black/60">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={enviando}
        className="relative w-full aspect-square rounded-[6px] border border-black/15 overflow-hidden bg-[#f2f2ef] flex items-center justify-center group"
        style={corPreview ? { background: corPreview } : undefined}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[12px] text-black/40 px-2 text-center">
            {enviando ? "Enviando..." : "Clique para enviar"}
          </span>
        )}
        {enviando && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-[12px]">
            Enviando...
          </div>
        )}
        {value && !enviando && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-[12px]">Trocar imagem</span>
          </div>
        )}
      </button>
      {erro && <span className="text-[12px] text-[var(--color-brand)]">{erro}</span>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
