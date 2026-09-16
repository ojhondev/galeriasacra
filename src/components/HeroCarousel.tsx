"use client";

import { useState } from "react";
import Link from "next/link";
import type { Produto } from "@/lib/products";

export function HeroCarousel({ produtos }: { produtos: Produto[] }) {
  const [indice, setIndice] = useState(0);
  const atual = produtos[indice];

  function anterior() {
    setIndice((i) => (i - 1 + produtos.length) % produtos.length);
  }

  function proximo() {
    setIndice((i) => (i + 1) % produtos.length);
  }

  return (
    <section>
      <Link href={`/quadros/${atual.slug}`} className="block w-full px-4 md:px-8">
        <div
          className="w-full h-[62vh] md:h-[82vh]"
          style={{
            background: `radial-gradient(120% 90% at 30% 20%, hsl(${atual.hue} 45% 92%) 0%, hsl(${atual.hue} 55% 62%) 45%, hsl(${atual.hue} 62% 28%) 100%)`,
          }}
        />
      </Link>

      <div className="flex items-center justify-end gap-x-8 px-4 md:px-8 py-4 text-[20px]">
        <button type="button" onClick={anterior} aria-label="Anterior">
          ←
        </button>
        <button type="button" onClick={proximo} aria-label="Próximo">
          →
        </button>
      </div>

      <div className="w-full h-px bg-black" />
    </section>
  );
}
