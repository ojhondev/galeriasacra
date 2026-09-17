"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { sair } from "@/lib/auth-actions";
import { IconSearch, IconUser, IconBag } from "@/components/icons";
import type { SessionPayload } from "@/lib/session";

const LINKS = [
  { href: "/quadros", label: "Quadros" },
  { href: "/monte-seu-quadro", label: "Monte Seu Quadro" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Nav({ sessao }: { sessao: SessionPayload | null }) {
  const router = useRouter();
  const { quantidadeTotal } = useCart();
  const [open, setOpen] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  function handleBuscar(e: FormEvent) {
    e.preventDefault();
    const termo = termoBusca.trim();
    if (!termo) return;
    router.push(`/quadros?busca=${encodeURIComponent(termo)}`);
    setBuscaAberta(false);
    setTermoBusca("");
  }

  return (
    <header className="w-full border-b border-black/10">
      <div className="flex items-center justify-between px-4 md:px-8 py-[20px]">
        <Link href="/" className="block shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-galeriasacra-vinho.png"
            alt="Galeria Sacra"
            width={765}
            height={406}
            priority
            className="h-[38px] w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-x-8 text-[16px]">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black/50 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-x-5">
          <button
            type="button"
            onClick={() => setBuscaAberta((v) => !v)}
            aria-label="Buscar"
            className="hidden sm:block"
          >
            <IconSearch />
          </button>

          {sessao?.role === "admin" && (
            <Link href="/admin" className="hidden lg:inline text-[15px] hover:text-black/50">
              Admin
            </Link>
          )}

          {sessao ? (
            <form action={sair}>
              <button type="submit" aria-label="Sair" title="Sair">
                <IconUser />
              </button>
            </form>
          ) : (
            <Link href="/login" aria-label="Entrar">
              <IconUser />
            </Link>
          )}

          <Link href="/carrinho" className="relative" aria-label="Carrinho">
            <IconBag />
            {quantidadeTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-[11px] leading-none w-[17px] h-[17px] flex items-center justify-center">
                {quantidadeTotal}
              </span>
            )}
          </Link>

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

      {buscaAberta && (
        <form
          onSubmit={handleBuscar}
          className="border-t border-black/10 px-4 md:px-8 py-[17px] flex gap-4 items-center"
        >
          <input
            autoFocus
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar quadros..."
            className="flex-1 bg-transparent outline-none text-[18px]"
          />
          <button type="submit" className="text-[14px] underline shrink-0">
            Buscar
          </button>
        </form>
      )}

      {open && (
        <nav className="lg:hidden flex flex-col gap-y-[17px] text-[18px] px-4 md:px-8 pb-[24px]">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {sessao?.role === "admin" && (
            <Link href="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
