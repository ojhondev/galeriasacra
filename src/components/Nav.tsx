"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { sair } from "@/lib/auth-actions";
import type { SessionPayload } from "@/lib/session";

const LINKS = [
  { href: "/quadros", label: "QUADROS" },
  { href: "/monte-seu-quadro", label: "MONTE SEU QUADRO" },
  { href: "/sobre", label: "SOBRE" },
  { href: "/contato", label: "CONTATO" },
];

export function Nav({ sessao }: { sessao: SessionPayload | null }) {
  const { quantidadeTotal } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full pt-[17px] pb-[17px] px-4 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-y-[11px]">
        <div className="flex flex-wrap items-center gap-x-[42px] gap-y-[11px]">
          <Link href="/" className="block" onClick={() => setOpen(false)}>
            <Image
              src="/logo-artusa.png"
              alt="Artusa"
              width={740}
              height={194}
              priority
              className="h-[22px] w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-x-8 text-[18px] tracking-artu">
            {LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-x-8">
                <Link href={link.href}>{link.label}</Link>
                {i < LINKS.length - 1 && <span aria-hidden="true">,</span>}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-x-8 text-[18px] tracking-artu">
          <Link href="/carrinho" className="hidden lg:inline">
            CARRINHO ({quantidadeTotal})
          </Link>
          {sessao?.role === "admin" && (
            <Link href="/admin" className="hidden lg:inline">
              ADMIN
            </Link>
          )}
          {sessao ? (
            <form action={sair} className="hidden lg:inline">
              <button type="submit">SAIR</button>
            </form>
          ) : (
            <Link href="/login" className="hidden lg:inline">
              ENTRAR
            </Link>
          )}
          <button type="button" className="hidden lg:inline">
            MENU
          </button>
          <button
            type="button"
            className="lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2 2L18 18M18 2L2 18" stroke="black" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                <path d="M0 1H22M0 7H22M0 13H22" stroke="black" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden flex flex-col gap-y-[17px] text-[18px] tracking-artu mt-[32px]">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/carrinho" onClick={() => setOpen(false)}>
            CARRINHO ({quantidadeTotal})
          </Link>
          {sessao?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)}>
              ADMIN
            </Link>
          )}
          {sessao ? (
            <form action={sair}>
              <button type="submit" onClick={() => setOpen(false)}>
                SAIR
              </button>
            </form>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              ENTRAR
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
