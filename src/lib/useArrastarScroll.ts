"use client";

import { useRef, useState, type PointerEvent } from "react";

export function useArrastarScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const estadoRef = useRef({ arrastando: false, startX: 0, scrollLeftInicial: 0, moveu: false });
  const [arrastando, setArrastando] = useState(false);

  function onPointerDown(e: PointerEvent) {
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    estadoRef.current = { arrastando: true, startX: e.clientX, scrollLeftInicial: el.scrollLeft, moveu: false };
    setArrastando(true);
  }

  function onPointerMove(e: PointerEvent) {
    const estado = estadoRef.current;
    const el = ref.current;
    if (!estado.arrastando || !el) return;
    const dx = e.clientX - estado.startX;
    if (Math.abs(dx) > 3) estado.moveu = true;
    el.scrollLeft = estado.scrollLeftInicial - dx;
  }

  function onPointerUp(e: PointerEvent) {
    const el = ref.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    estadoRef.current.arrastando = false;
    setArrastando(false);
  }

  function bloquearCliqueSeArrastou(e: React.MouseEvent) {
    if (estadoRef.current.moveu) e.preventDefault();
  }

  function rolar(deltaPx: number) {
    ref.current?.scrollBy({ left: deltaPx, behavior: "smooth" });
  }

  return {
    ref,
    arrastando,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    bloquearCliqueSeArrastou,
    rolar,
  };
}
