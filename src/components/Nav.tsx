"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { sair } from "@/lib/auth-actions";
import { IconSearch, IconUser, IconBag, IconClose } from "@/components/icons";
import { CircularCategories } from "@/components/CircularCategories";
import type { SessionPayload } from "@/lib/session";
import type { Produto } from "@/lib/products";

const LINKS = [
  { href: "/quadros", label: "Quadros" },
  { href: "/monte-seu-quadro", label: "Monte Seu Quadro" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Nav({ sessao, produtos }: { sessao: SessionPayload | null; produtos: Produto[] }) {
  const router = useRouter();
  const { quantidadeTotal, abrirDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaBusca, setCategoriaBusca] = useState("");

  const categorias = useMemo(
    () => Array.from(new Set(produtos.map((p) => p.categoria))),
    [produtos],
  );

  function handleBuscar(e: FormEvent) {
    e.preventDefault();
    const termo = termoBusca.trim();
    const params = new URLSearchParams();
    if (categoriaBusca) params.set("categoria", categoriaBusca);
    if (termo) params.set("busca", termo);
    router.push(`/quadros${params.toString() ? `?${params.toString()}` : ""}`);
    setBuscaAberta(false);
  }

  return (
    <header className="w-full border-b border-black/10 rounded-none sticky top-0 z-40 bg-white">
      <div className="flex items-center gap-4 md:gap-8 px-4 md:px-8 py-[17px]">
        <Link href="/" className="block shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo-galeriasacra-vinho.png"
            alt="Galeria Sacra"
            width={765}
            height={406}
            priority
            className="h-[46px] w-auto"
          />
        </Link>

        <form
          onSubmit={handleBuscar}
          className="hidden md:flex flex-1 max-w-[560px] items-stretch border border-black/20 rounded-[6px] overflow-hidden"
        >
          <select
            value={categoriaBusca}
            onChange={(e) => setCategoriaBusca(e.target.value)}
            className="bg-[#f7f7f5] border-r border-black/20 px-3 text-[14px] text-black/70 outline-none max-w-[160px]"
          >
            <option value="">Todas Categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
          <input
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="O que você está procurando?"
            className="flex-1 min-w-0 px-3 text-[14px] outline-none"
          />
          <button type="submit" aria-label="Buscar" className="px-4 flex items-center justify-center">
            <IconSearch />
          </button>
        </form>

        <div className="flex items-center gap-x-5 ml-auto md:ml-0">
          <button
            type="button"
            onClick={() => setBuscaAberta((v) => !v)}
            aria-label="Buscar"
            className="md:hidden"
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

          <button type="button" onClick={abrirDrawer} className="relative" aria-label="Carrinho">
            <IconBag />
            {quantidadeTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-[11px] leading-none w-[17px] h-[17px] flex items-center justify-center">
                {quantidadeTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            className="lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <IconClose />
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
          className="md:hidden border-t border-black/10 px-4 py-[17px] flex gap-4 items-center"
        >
          <input
            autoFocus
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar quadros..."
            className="flex-1 bg-transparent outline-none text-[16px]"
          />
          <button type="submit" className="text-[14px] underline shrink-0">
            Buscar
          </button>
        </form>
      )}

      <nav className="hidden lg:flex items-center gap-x-8 text-[15px] px-4 md:px-8 py-3 border-t border-black/10">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-black/50 transition-colors">
            {link.label}
          </Link>
        ))}
        <Link href="/quadros" className="ml-auto text-[var(--color-brand)] font-medium">
          Ofertas
        </Link>
      </nav>

      {open && (
        <nav className="lg:hidden flex flex-col gap-y-[17px] text-[18px] px-4 md:px-8 py-[24px] border-t border-black/10">
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

      <div className="border-t border-black/10">
        <CircularCategories produtos={produtos} />
      </div>
    </header>
  );
}
