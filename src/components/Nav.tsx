"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/quadros", label: "QUADROS" },
  { href: "/monte-seu-quadro", label: "MONTE SEU QUADRO" },
  { href: "/sobre", label: "SOBRE" },
  { href: "/contato", label: "CONTATO" },
];

export function Nav() {
  const { quantidadeTotal } = useCart();

  return (
    <header className="w-full pt-[17px] pb-[17px] px-4 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-y-[11px] max-w-[var(--page-max-width)] mx-auto">
        <Link href="/" className="text-[20px] leading-none">
          galeria sacra
        </Link>

        <nav className="hidden lg:flex items-center gap-x-8 text-[18px] tracking-artu">
          {LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-x-8">
              <Link href={link.href}>{link.label}</Link>
              {i < LINKS.length - 1 && <span aria-hidden="true">,</span>}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-x-8 text-[18px] tracking-artu">
          <Link href="/carrinho">CARRINHO ({quantidadeTotal})</Link>
          <button type="button" className="lg:hidden" aria-label="Menu">
            MENU
          </button>
        </div>
      </div>

      <nav className="lg:hidden flex flex-wrap gap-x-6 gap-y-2 text-[18px] tracking-artu mt-[17px] max-w-[var(--page-max-width)] mx-auto">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
