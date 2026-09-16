import type { Metadata } from "next";
import { CatalogoFiltravel } from "@/components/CatalogoFiltravel";
import { listarProdutos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Quadros | Artusa",
};

export const dynamic = "force-dynamic";

export default async function QuadrosPage() {
  const produtos = await listarProdutos();

  return (
    <div id="topo" className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Quadros</h1>
      <CatalogoFiltravel produtos={produtos} />
    </div>
  );
}
