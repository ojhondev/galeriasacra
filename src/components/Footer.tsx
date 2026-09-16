import Link from "next/link";

const SITE_LINKS = [
  { href: "/quadros", label: "QUADROS" },
  { href: "/monte-seu-quadro", label: "MONTE SEU QUADRO" },
  { href: "/sobre", label: "SOBRE" },
  { href: "/contato", label: "CONTATO" },
  { href: "/trocas-e-devolucoes", label: "TROCAS E DEVOLUÇÕES" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com/galeriasacra", label: "INSTAGRAM" },
  { href: "https://wa.me/5500000000000", label: "WHATSAPP" },
];

export function Footer() {
  return (
    <footer className="w-full">
      <div className="border-t border-black px-4 md:px-8 pt-8 pb-8">
        <div className="max-w-[var(--page-max-width)] mx-auto">
          <a
            href="mailto:contato@galeriasacra.com.br"
            className="text-[18px] tracking-artu block mb-[29px]"
          >
            CONTATO@GALERIASACRA.COM.BR
          </a>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[18px] tracking-artu mb-[29px]">
            {SITE_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[18px] tracking-artu mb-[37px]">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[18px] tracking-artu">
            © Galeria Sacra, {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="w-full h-8 md:h-[32px] bg-[var(--color-terminal-lime)]" />
    </footer>
  );
}
