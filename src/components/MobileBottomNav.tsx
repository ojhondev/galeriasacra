"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { IconHome, IconGrid, IconPlus, IconBag, IconUser } from "@/components/icons";
import type { SessionPayload } from "@/lib/session";

export function MobileBottomNav({ sessao }: { sessao: SessionPayload | null }) {
  const pathname = usePathname();
  const { quantidadeTotal, abrirDrawer } = useCart();

  const ativo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href="/"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 ${
          ativo("/") ? "text-black" : "text-black/40"
        }`}
      >
        <IconHome />
        <span className="text-[11px]">Início</span>
      </Link>

      <Link
        href="/quadros"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 ${
          ativo("/quadros") ? "text-black" : "text-black/40"
        }`}
      >
        <IconGrid />
        <span className="text-[11px]">Quadros</span>
      </Link>

      <Link href="/monte-seu-quadro" className="flex-1 flex flex-col items-center justify-center gap-1 py-2">
        <span
          className="w-11 h-11 -mt-4 flex items-center justify-center text-white shadow-lg"
          style={{ background: "var(--color-brand)", borderRadius: "9999px" }}
        >
          <IconPlus />
        </span>
      </Link>

      <button
        type="button"
        onClick={abrirDrawer}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-black/40 relative"
      >
        <span className="relative">
          <IconBag />
          {quantidadeTotal > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--color-brand)] text-white text-[10px] leading-none w-[15px] h-[15px] rounded-full flex items-center justify-center">
              {quantidadeTotal}
            </span>
          )}
        </span>
        <span className="text-[11px]">Carrinho</span>
      </button>

      <Link
        href={sessao?.role === "admin" ? "/admin" : "/login"}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 ${
          ativo("/login") || ativo("/admin") ? "text-black" : "text-black/40"
        }`}
      >
        <IconUser />
        <span className="text-[11px]">Conta</span>
      </Link>
    </nav>
  );
}
