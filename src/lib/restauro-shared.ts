export const STATUS_RESTAURO = ["novo", "em_analise", "orcamento_enviado", "aprovado", "recusado"] as const;

export type StatusRestauro = (typeof STATUS_RESTAURO)[number];

export const STATUS_RESTAURO_LABEL: Record<StatusRestauro, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  orcamento_enviado: "Orçamento enviado",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

export const STATUS_RESTAURO_COR: Record<StatusRestauro, string> = {
  novo: "#2f6fb8",
  em_analise: "#b8902f",
  orcamento_enviado: "#6b2fb8",
  aprovado: "#2f7a4f",
  recusado: "#b83b3b",
};

export const TIPOS_OBRA = ["Pintura a Óleo", "Acrílico", "Aquarela", "Têmpera", "Afresco", "Outro"] as const;

export const TIPOS_DANO = [
  "Rasgos",
  "Mofo ou manchas",
  "Craquelê",
  "Sujidade",
  "Amarelamento do verniz",
  "Dobras ou amassados",
  "Perda de pigmento",
  "Moldura danificada",
  "Outro",
] as const;

export const NIVEIS_URGENCIA = ["Sem pressa", "Moderada", "Urgente"] as const;
