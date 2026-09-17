import { Accordion } from "@/components/Accordion";

const PERGUNTAS = [
  {
    pergunta: "Os quadros têm garantia?",
    resposta:
      "Sim. Cada peça passa por controle de qualidade antes do envio e cobrimos defeitos de fabricação. Consulte nossa política de trocas e devoluções para detalhes.",
  },
  {
    pergunta: "Posso trocar o tamanho ou a moldura depois de comprar?",
    resposta:
      "Como cada peça é produzida sob medida, alterações após a confirmação do pedido não são garantidas. Entre em contato o quanto antes pelo WhatsApp que verificamos se ainda dá tempo.",
  },
  {
    pergunta: "Quanto tempo leva para meu pedido chegar?",
    resposta:
      "O prazo de produção varia por tamanho e acabamento, mais o prazo de transporte até sua região (veja a estimativa na página de cada produto). O prazo final é confirmado no carrinho.",
  },
  {
    pergunta: "Meu pedido chegou danificado, e agora?",
    resposta:
      "Fale com a gente em até 7 dias após o recebimento pelo contato@galeriasacra.com.br com fotos da avaria — resolvemos com troca sem custo.",
  },
];

export function FAQSection() {
  return (
    <section className="px-4 md:px-8 py-[64px]">
      <p className="text-[28px] md:text-[36px] mb-[24px]">Perguntas Frequentes</p>
      <div>
        {PERGUNTAS.map((item) => (
          <Accordion key={item.pergunta} titulo={item.pergunta}>
            <p>{item.resposta}</p>
          </Accordion>
        ))}
        <div className="border-t border-black" />
      </div>
    </section>
  );
}
