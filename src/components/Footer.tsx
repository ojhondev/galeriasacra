"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const SOCIAL_LINKS = [
  { href: "https://instagram.com/artusa", label: "INSTAGRAM" },
  { href: "https://wa.me/5500000000000", label: "WHATSAPP" },
];

export function Footer() {
  const { quantidadeTotal } = useCart();
  const [inscrito, setInscrito] = useState(false);

  return (
    <footer className="w-full">
      <div className="border-t border-black px-4 md:px-8 pt-[42px] pb-[80px] bg-[var(--color-brand)] text-white">
        <div className="flex flex-wrap gap-x-16 gap-y-[37px]">
          <div className="flex flex-col gap-y-2 text-[18px] tracking-artu">
            <a href="mailto:contato@artusa.com.br">CONTATO@ARTUSA.COM.BR</a>
          </div>

          <nav className="flex flex-col gap-y-2 text-[18px] tracking-artu">
            <Link href="/quadros">QUADROS</Link>
            <Link href="/carrinho">CARRINHO ({quantidadeTotal})</Link>
            <Link href="/monte-seu-quadro">MONTE SEU QUADRO</Link>
            <Link href="/sobre">SOBRE</Link>
            <Link href="/trocas-e-devolucoes">TROCAS E DEVOLUÇÕES</Link>
          </nav>

          <nav className="flex flex-col gap-y-2 text-[18px] tracking-artu">
            <Link href="/contato">CONTATO</Link>
          </nav>

          <nav className="flex flex-col gap-y-2 text-[18px] tracking-artu">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-y-8 mt-[80px]">
          <p className="text-[18px] tracking-artu">© Artusa, {new Date().getFullYear()}</p>

          <form
            className="flex flex-col gap-2 w-full md:w-[320px]"
            onSubmit={(e) => {
              e.preventDefault();
              setInscrito(true);
            }}
          >
            {inscrito ? (
              <p className="text-[18px] tracking-artu">Inscrição recebida.</p>
            ) : (
              <>
                <label htmlFor="newsletter-email" className="text-[18px] tracking-artu">
                  Assine nossa newsletter
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="E-mail"
                  className="bg-transparent border-b border-white text-[18px] py-1 outline-none placeholder:text-white/60"
                />
              </>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
}
