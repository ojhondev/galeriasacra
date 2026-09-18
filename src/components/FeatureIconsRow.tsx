import Link from "next/link";
import { IconHand, IconCheck, IconBox } from "@/components/icons";
import { formatarPreco } from "@/lib/pricing";

export function FeatureIconsRow({ freteGratisMinimo }: { freteGratisMinimo: number }) {
  const itens = [
    {
      Icon: IconHand,
      titulo: "Atendimento Dedicado",
      texto: "Nosso time responde rápido e ajuda em cada etapa da sua compra.",
      href: "/contato",
      link: "Fale conosco",
    },
    {
      Icon: IconCheck,
      titulo: "Satisfação Garantida",
      texto: "Troca ou devolução em até 7 dias para peças do catálogo.",
      href: "/trocas-e-devolucoes",
      link: "Saiba mais",
    },
    {
      Icon: IconBox,
      titulo: "Frete Grátis",
      texto: `Em compras acima de ${formatarPreco(freteGratisMinimo)}, para todo o Brasil.`,
      href: "/quadros",
      link: "Ver catálogo",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-[64px] grid grid-cols-1 md:grid-cols-3 gap-[42px]">
      {itens.map(({ Icon, titulo, texto, href, link }) => (
        <div key={titulo}>
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
            <Icon />
          </div>
          <p className="text-[22px] mb-2">{titulo}</p>
          <p className="text-[15px] text-black/60 leading-[1.4] mb-3 max-w-[280px]">{texto}</p>
          <Link href={href} className="text-[14px] underline">
            {link}
          </Link>
        </div>
      ))}
    </section>
  );
}
