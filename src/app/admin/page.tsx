import Link from "next/link";
import { obterSessao } from "@/lib/session";

export default async function AdminPage() {
  const sessao = await obterSessao();

  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-4">Painel Admin</h1>
      <p className="text-[18px] mb-[42px]">Olá, {sessao?.nome}.</p>

      <div className="flex flex-wrap gap-[32px]">
        <Link href="/admin/produtos" className="border border-black px-8 py-6 text-[20px] tracking-artu">
          PRODUTOS
        </Link>
        <Link href="/admin/etiquetas" className="border border-black px-8 py-6 text-[20px] tracking-artu">
          ETIQUETAS DE DESCONTO
        </Link>
        <Link href="/admin/avaliacoes" className="border border-black px-8 py-6 text-[20px] tracking-artu">
          AVALIAÇÕES
        </Link>
      </div>
    </div>
  );
}
