import Link from "next/link";

export function PromoBanner({ label }: { label: string }) {
  return (
    <section
      className="grid md:grid-cols-2 min-h-[420px] md:min-h-[520px] text-white rounded-none"
      style={{ background: "var(--color-brand)" }}
    >
      <div className="flex flex-col justify-center px-4 md:px-10 py-[64px]">
        <p className="text-[13px] tracking-artu text-white/60 mb-3">Oferta</p>
        <p className="text-[clamp(32px,5vw,52px)] leading-[1.1] mb-8 max-w-md">{label}</p>
        <Link
          href="/quadros"
          className="bg-white text-black px-6 py-3 text-[15px] rounded-[6px] w-fit hover:bg-white/80 transition-colors"
        >
          Ver Coleção
        </Link>
      </div>

      {/* Espaço reservado para imagem */}
      <div className="hidden md:block" aria-hidden="true" />
    </section>
  );
}
