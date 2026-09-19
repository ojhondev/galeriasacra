"use client";

import Image from "next/image";
import Link from "next/link";
import { IconClose } from "@/components/icons";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] bg-white flex">
      <div className="hidden md:block relative w-1/2 h-full shrink-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/sacra-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
          <p className="text-[13px] tracking-artu uppercase mb-3">Galeria Sacra</p>
          <h2 className="text-[clamp(24px,3vw,34px)] leading-tight max-w-sm">
            Arte sacra que transforma o espaço
          </h2>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-8 py-[17px] shrink-0">
          <Image
            src="/logo-galeriasacra-vinho.png"
            alt="Galeria Sacra"
            width={765}
            height={406}
            className="h-[32px] w-auto"
          />
          <Link href="/" aria-label="Fechar" className="text-black/60 hover:text-black">
            <IconClose />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 md:px-8 py-[24px]">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
