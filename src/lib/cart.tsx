"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MaterialId, MolduraId } from "@/lib/pricing";

export type ItemCarrinho = {
  id: string;
  nome: string;
  hue: number;
  tamanho: string;
  tamanhoLabel: string;
  moldura: MolduraId;
  molduraLabel: string;
  material: MaterialId;
  materialLabel: string;
  personalizado: boolean;
  precoUnitario: number;
  quantidade: number;
};

type CarrinhoContexto = {
  itens: ItemCarrinho[];
  adicionar: (item: Omit<ItemCarrinho, "id" | "quantidade"> & { quantidade?: number }) => void;
  remover: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  esvaziar: () => void;
  total: number;
  quantidadeTotal: number;
  drawerAberto: boolean;
  abrirDrawer: () => void;
  fecharDrawer: () => void;
};

const CarrinhoContext = createContext<CarrinhoContexto | null>(null);

const STORAGE_KEY = "galeriasacra:carrinho";

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const abrirDrawer = useCallback(() => setDrawerAberto(true), []);
  const fecharDrawer = useCallback(() => setDrawerAberto(false), []);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação única do carrinho a partir do localStorage, precisa ocorrer após o mount para não quebrar o SSR
      if (salvo) setItens(JSON.parse(salvo));
    } catch {
      // ignora storage indisponível
    }
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {
      // ignora storage indisponível
    }
  }, [itens, carregado]);

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "id" | "quantidade"> & { quantidade?: number }) => {
      setItens((atual) => [
        ...atual,
        {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          quantidade: Math.max(1, item.quantidade ?? 1),
        },
      ]);
    },
    [],
  );

  const remover = useCallback((id: string) => {
    setItens((atual) => atual.filter((i) => i.id !== id));
  }, []);

  const atualizarQuantidade = useCallback((id: string, quantidade: number) => {
    setItens((atual) =>
      atual.map((i) => (i.id === id ? { ...i, quantidade: Math.max(1, quantidade) } : i)),
    );
  }, []);

  const esvaziar = useCallback(() => setItens([]), []);

  const total = useMemo(
    () => itens.reduce((soma, i) => soma + i.precoUnitario * i.quantidade, 0),
    [itens],
  );

  const quantidadeTotal = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade, 0),
    [itens],
  );

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionar,
        remover,
        atualizarQuantidade,
        esvaziar,
        total,
        quantidadeTotal,
        drawerAberto,
        abrirDrawer,
        fecharDrawer,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
