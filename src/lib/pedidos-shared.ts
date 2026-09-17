export const STATUS_PEDIDO = [
  "aguardando_pagamento",
  "pago",
  "em_producao",
  "enviado",
  "concluido",
  "cancelado",
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export const STATUS_LABEL: Record<StatusPedido, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  em_producao: "Em produção",
  enviado: "Enviado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const STATUS_COR: Record<StatusPedido, string> = {
  aguardando_pagamento: "#b8902f",
  pago: "#2f7a4f",
  em_producao: "#2f6fb8",
  enviado: "#6b2fb8",
  concluido: "#1a1a1a",
  cancelado: "#b83b3b",
};
