"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChart,
  IconReceipt,
  IconBox,
  IconTag,
  IconStarOutline,
  IconLogout,
  IconRefresh,
  IconGrid,
  IconUser,
  IconTruck,
} from "@/components/icons";
import { sair } from "@/lib/auth-actions";
import type { SessionPayload } from "@/lib/session";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: IconChart, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: IconReceipt },
  { href: "/admin/restauros", label: "Restauros", icon: IconRefresh },
  { href: "/admin/produtos", label: "Produtos", icon: IconBox },
  { href: "/admin/colecoes", label: "Coleções", icon: IconGrid },
  { href: "/admin/clientes", label: "Clientes", icon: IconUser },
  { href: "/admin/frete", label: "Frete", icon: IconTruck },
  { href: "/admin/etiquetas", label: "Etiquetas", icon: IconTag },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: IconStarOutline },
];

export function AdminShell({
  sessao,
  children,
}: {
  sessao: SessionPayload | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#f7f7f5]">
      <aside className="hidden md:flex w-[240px] shrink-0 flex-col bg-white border-r border-black/10">
        <div className="px-6 py-[24px] border-b border-black/10">
          <Link href="/" className="text-[16px] font-semibold tracking-tight">
            Galeria Sacra
          </Link>
          <p className="text-[12px] text-black/40 mt-0.5">Painel Administrativo</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const ativo = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-[14px] rounded-[6px] transition-colors ${
                  ativo ? "bg-black text-white" : "text-black/70 hover:bg-black/5"
                }`}
              >
                <Icon className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-black/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-[14px] rounded-[6px] text-black/70 hover:bg-black/5"
          >
            ← Voltar para a loja
          </Link>
          <form action={sair}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] rounded-[6px] text-black/70 hover:bg-black/5"
            >
              <IconLogout className="shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-[17px] bg-white border-b border-black/10">
          <Link href="/admin" className="text-[16px] font-semibold">
            Painel Admin
          </Link>
          <div className="flex items-center gap-4 text-[13px] text-black/60">
            <nav className="flex items-center gap-4">
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="hidden md:flex items-center justify-end px-8 py-4 bg-white border-b border-black/10">
          <p className="text-[14px] text-black/60">
            Olá, <span className="text-black">{sessao?.nome}</span>
          </p>
        </div>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
