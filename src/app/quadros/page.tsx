import type { Metadata } from "next";
import { CatalogoFiltravel } from "@/components/CatalogoFiltravel";
import { listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Quadros | Galeria Sacra",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
};

export default async function QuadrosPage({ searchParams }: Props) {
  const { categoria, busca } = await searchParams;
  const produtos = await listarProdutos();

  return (
    <div id="topo">
      <div className="w-full h-[180px] md:h-[260px] bg-[#f2f2ef] rounded-none flex items-center justify-center">
        <p className="text-[13px] tracking-artu text-black/40">Espaço reservado para banner</p>
      </div>

      <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
        <h1 className="text-[32px] mb-[32px]">Quadros</h1>
        <CatalogoFiltravel produtos={produtos} categoriaInicial={categoria} buscaInicial={busca} />
      </div>
    </div>
  );
}
