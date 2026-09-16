import Link from "next/link";

export function Hero() {
  return (
    <section>
      <div className="w-full px-4 md:px-8">
        <div className="relative w-full h-[62vh] md:h-[82vh] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/videos/sacra-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-4">
            <p className="text-white text-[32px] md:text-[56px] text-center leading-[1.05] tracking-artu max-w-4xl">
              Curadoria de quadros sacros exclusivos
            </p>
            <Link
              href="/monte-seu-quadro"
              className="bg-white text-black px-8 py-4 text-[18px] tracking-artu hover:bg-black hover:text-white transition-colors"
            >
              MONTE SEU QUADRO
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-black mt-4" />
    </section>
  );
}
