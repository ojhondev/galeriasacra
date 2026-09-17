export type Avaliacao = {
  id: string;
  produtoId: string;
  nomeCliente: string;
  nota: number;
  comentario: string;
  createdAt: Date;
};

export function calcularMedia(lista: Avaliacao[]): number {
  if (lista.length === 0) return 0;
  return lista.reduce((soma, a) => soma + a.nota, 0) / lista.length;
}
