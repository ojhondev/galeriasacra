import type { Metadata } from "next";
import { CatalogoFiltravel } from "@/components/CatalogoFiltravel";
import { produtos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Quadros | Artusa",
};

export default function QuadrosPage() {
  return (
    <div id="topo" className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[32px]">Quadros</h1>
      <CatalogoFiltravel produtos={produtos} />
    </div>
  );
}
