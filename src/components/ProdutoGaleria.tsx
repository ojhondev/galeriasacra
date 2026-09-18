import { ArtPlate } from "@/components/ArtPlate";
import type { Produto } from "@/lib/products";

type ProdutoGaleriaProps = {
  produto: Produto;
  molduraColor: string | null;
  imagemUrl?: string | null;
};

export function ProdutoGaleria({ produto, molduraColor, imagemUrl = null }: ProdutoGaleriaProps) {
  return (
    <div className="relative bg-[#f2f2ef] p-[8%]">
      <ArtPlate orientacao={produto.orientacao} molduraColor={molduraColor} imagemUrl={imagemUrl} />
    </div>
  );
}
