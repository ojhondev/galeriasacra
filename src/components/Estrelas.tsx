export function Estrelas({ nota, tamanho = 16 }: { nota: number; tamanho?: number }) {
  const cheias = Math.round(nota);
  return (
    <span style={{ fontSize: tamanho }} aria-label={`${nota.toFixed(1)} de 5 estrelas`}>
      <span className="text-[var(--color-brand)]">{"★".repeat(cheias)}</span>
      <span className="text-black/20">{"★".repeat(5 - cheias)}</span>
    </span>
  );
}
