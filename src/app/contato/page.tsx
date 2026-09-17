"use client";

import { useState } from "react";

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[42px]">Contato</h1>

      <div className="grid md:grid-cols-2 gap-[32px] max-w-4xl">
        <div className="flex flex-col gap-4">
          <p className="text-[20px]">
            <a href="mailto:contato@galeriasacra.com.br" className="underline">
              contato@galeriasacra.com.br
            </a>
          </p>
          <p className="text-[20px]">
            <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="underline">
              WhatsApp
            </a>
          </p>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            setEnviado(true);
          }}
        >
          <div>
            <label className="text-[14px] text-black/60 block mb-2" htmlFor="nome">
              Nome
            </label>
            <input
              id="nome"
              required
              className="w-full border-b border-black bg-transparent text-[20px] py-2 outline-none"
            />
          </div>
          <div>
            <label className="text-[14px] text-black/60 block mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full border-b border-black bg-transparent text-[20px] py-2 outline-none"
            />
          </div>
          <div>
            <label className="text-[14px] text-black/60 block mb-2" htmlFor="mensagem">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              required
              rows={4}
              className="w-full border-b border-black bg-transparent text-[20px] py-2 outline-none resize-none"
            />
          </div>
          <button type="submit" className="bg-black text-white px-6 py-3 text-[15px] self-start">
            Enviar
          </button>
          {enviado && (
            <p className="text-[16px] text-[var(--color-brand)]">
              Mensagem recebida. Responderemos em breve.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
