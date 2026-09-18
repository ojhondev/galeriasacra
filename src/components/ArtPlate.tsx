import type { Orientacao } from "@/lib/products";

const ASPECT: Record<Orientacao, string> = {
  retrato: "3 / 4",
  paisagem: "4 / 3",
  quadrado: "1 / 1",
};

const PLACEHOLDER: Record<Orientacao, string> = {
  retrato: "/placeholders/retrato.png",
  paisagem: "/placeholders/paisagem.png",
  quadrado: "/placeholders/quadrado.png",
};

type ArtPlateProps = {
  orientacao?: Orientacao;
  molduraColor?: string | null;
  className?: string;
  hoverZoom?: boolean;
  fill?: boolean;
  /** Foto real da obra já emoldurada nessa variante — substitui o placeholder genérico quando presente. */
  imagemUrl?: string | null;
};

export function ArtPlate({
  orientacao = "retrato",
  molduraColor = null,
  className = "",
  hoverZoom = false,
  fill = false,
  imagemUrl = null,
}: ArtPlateProps) {
  const overflowClass = hoverZoom ? "overflow-hidden" : "";
  const src = imagemUrl ?? PLACEHOLDER[orientacao];

  const foto = (
    <div className="w-full h-full" style={{ aspectRatio: fill ? undefined : ASPECT[orientacao] }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className={`w-full h-full object-cover ${hoverZoom ? "transition-transform duration-500 ease-out group-hover:scale-110" : ""}`}
      />
    </div>
  );

  if (!molduraColor) {
    return <div className={`${overflowClass} ${className}`}>{foto}</div>;
  }

  return (
    <div className={`${overflowClass} ${className}`} style={{ background: molduraColor, padding: "3.2%" }}>
      {foto}
    </div>
  );
}
