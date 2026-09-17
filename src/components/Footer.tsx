"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [inscrito, setInscrito] = useState(false);

  return (
    <footer className="w-full text-white rounded-none" style={{ background: "var(--color-brand)" }}>
      <div className="px-4 md:px-8 pt-[64px] pb-[42px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-[42px]">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[20px] font-bold tracking-wide mb-3">GALERIA SACRA</p>
            <p className="text-[14px] text-white/60 leading-[1.4] max-w-[220px]">
              Arte sacra contemporânea, produzida sob medida para lares, capelas e espaços de
              oração.
            </p>
          </div>

          <div>
            <p className="text-[15px] font-medium mb-3">Loja</p>
            <nav className="flex flex-col gap-2 text-[14px] text-white/70">
              <Link href="/quadros" className="hover:text-white">Quadros</Link>
              <Link href="/monte-seu-quadro" className="hover:text-white">Monte Seu Quadro</Link>
              <Link href="/carrinho" className="hover:text-white">Carrinho</Link>
            </nav>
          </div>

          <div>
            <p className="text-[15px] font-medium mb-3">Atendimento</p>
            <nav className="flex flex-col gap-2 text-[14px] text-white/70">
              <Link href="/contato" className="hover:text-white">Contato</Link>
              <Link href="/trocas-e-devolucoes" className="hover:text-white">Trocas e Devoluções</Link>
              <Link href="/sobre" className="hover:text-white">Sobre</Link>
            </nav>
          </div>

          <div>
            <p className="text-[15px] font-medium mb-3">Contato</p>
            <div className="flex flex-col gap-2 text-[14px] text-white/70">
              <a href="mailto:contato@galeriasacra.com.br" className="hover:text-white">
                contato@galeriasacra.com.br
              </a>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/galeriasacra"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-[15px] font-medium mb-3">Fique por dentro</p>
            <p className="text-[13px] text-white/60 mb-3">
              Novidades do catálogo e ofertas, direto no seu e-mail.
            </p>
            {inscrito ? (
              <p className="text-[14px]">Inscrição recebida.</p>
            ) : (
              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  setInscrito(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail"
                  className="flex-1 min-w-0 bg-white/10 px-3 py-2 text-[14px] outline-none placeholder:text-white/40"
                />
                <button type="submit" className="bg-white text-black px-4 py-2 text-[13px] rounded-[6px] shrink-0">
                  Assinar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 md:px-8 py-[24px] flex flex-wrap items-center justify-between gap-4 text-[13px] text-white/50">
        <p>© {new Date().getFullYear()} Galeria Sacra. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <span className="border border-white/20 px-2 py-1 text-[12px]">Pix</span>
          <span className="border border-white/20 px-2 py-1 text-[12px]">Visa</span>
          <span className="border border-white/20 px-2 py-1 text-[12px]">Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
