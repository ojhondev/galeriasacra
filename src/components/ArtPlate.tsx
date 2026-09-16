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
};

export function ArtPlate({ hue, orientacao = "retrato", molduraColor = null, className = "" }: ArtPlateProps) {
  const plate = (
    <div
      className="w-full h-full"
      style={{
        aspectRatio: ASPECT[orientacao],
        background: `radial-gradient(120% 90% at 30% 20%, hsl(${hue} 45% 92%) 0%, hsl(${hue} 55% 62%) 45%, hsl(${hue} 62% 28%) 100%)`,
      }}
    />
  );

  if (!molduraColor) {
    return <div className={className}>{plate}</div>;
  }

  return (
    <div className={className} style={{ background: molduraColor, padding: "3.2%" }}>
      {plate}
    </div>
  );
}
