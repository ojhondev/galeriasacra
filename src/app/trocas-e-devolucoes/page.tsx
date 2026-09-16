import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas e Devoluções | Artusa",
};

export default function TrocasEDevolucoesPage() {
  return (
    <div className="px-4 md:px-8 pt-[42px] pb-[80px]">
      <h1 className="text-[32px] mb-[42px]">Trocas e Devoluções</h1>
      <div className="max-w-2xl flex flex-col gap-6 text-[20px] leading-[1.2]">
        <p>
          Quadros do catálogo, sem personalização, podem ser trocados ou devolvidos em até
          7 dias corridos após o recebimento, desde que estejam em perfeito estado.
        </p>
        <p>
          Quadros personalizados na seção Monte Seu Quadro — com imagem própria, tamanho,
          moldura ou material diferentes do padrão — são produzidos sob medida e não podem
          ser trocados ou devolvidos, exceto em caso de defeito de fabricação.
        </p>
        <p>
          Em caso de defeito de fabricação ou avaria no transporte, entre em contato pelo{" "}
          <a href="mailto:contato@artusa.com.br" className="underline">
            contato@artusa.com.br
          </a>{" "}
          em até 7 dias após o recebimento.
        </p>
      </div>
    </div>
  );
}
