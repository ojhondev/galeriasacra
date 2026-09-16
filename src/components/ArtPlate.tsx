import type { Orientacao } from "@/lib/products";

const ASPECT: Record<Orientacao, string> = {
  retrato: "3 / 4",
  paisagem: "4 / 3",
  quadrado: "1 / 1",
};

type ArtPlateProps = {
  hue: number;
  orientacao?: Orientacao;
  molduraColor?: string | null;
  className?: string;
  hoverZoom?: boolean;
};

export function ArtPlate({
  hue,
  orientacao = "retrato",
  molduraColor = null,
  className = "",
  hoverZoom = false,
}: ArtPlateProps) {
  const plate = (
    <div
      className={`w-full h-full ${hoverZoom ? "transition-transform duration-500 ease-out group-hover:scale-110" : ""}`}
      style={{
        aspectRatio: ASPECT[orientacao],
        background: `radial-gradient(120% 90% at 30% 20%, hsl(${hue} 45% 92%) 0%, hsl(${hue} 55% 62%) 45%, hsl(${hue} 62% 28%) 100%)`,
      }}
    />
  );

  const overflowClass = hoverZoom ? "overflow-hidden" : "";

  if (!molduraColor) {
    return <div className={`${overflowClass} ${className}`}>{plate}</div>;
  }

  return (
    <div className={`${overflowClass} ${className}`} style={{ background: molduraColor, padding: "3.2%" }}>
      {plate}
    </div>
  );
}
