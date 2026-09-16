import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { produtos } from "@/lib/products";

export const metadata: Metadata = {
  title: "Quadros | Galeria Sacra",
};

export default function QuadrosPage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px] max-w-[var(--page-max-width)] mx-auto">
      <h1 className="text-[32px] mb-[42px]">Quadros</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[32px] gap-y-[42px]">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}
