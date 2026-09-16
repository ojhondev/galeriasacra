"use client";

import { useEffect, useRef, useState } from "react";

type ARPreviewProps = {
  aspectRatio: number;
  hue: number;
  molduraColor?: string | null;
  imagemUrl?: string | null;
  onClose: () => void;
};

type Box = { x: number; y: number; width: number };

export function ARPreview({ aspectRatio, hue, molduraColor, imagemUrl, onClose }: ARPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [box, setBox] = useState<Box>(() => {
    const largura = Math.min(280, window.innerWidth * 0.55);
    return {
      x: window.innerWidth / 2 - largura / 2,
      y: window.innerHeight / 2 - largura / aspectRatio / 2,
      width: largura,
    };
  });
  const dragRef = useRef<{ mode: "mover" | "redimensionar"; startX: number; startY: number; box: Box } | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        setErro("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function iniciarArraste(e: React.PointerEvent, mode: "mover" | "redimensionar") {
    if (!box) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { mode, startX: e.clientX, startY: e.clientY, box };
  }

  function mover(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.mode === "mover") {
      setBox({ ...drag.box, x: drag.box.x + dx, y: drag.box.y + dy });
    } else {
      const novaLargura = Math.max(80, drag.box.width + dx);
      setBox({ ...drag.box, width: novaLargura });
    }
  }

  function pararArraste(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {erro && (
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="text-white text-[20px] text-center max-w-sm">{erro}</p>
        </div>
      )}

      {!erro && box && (
        <div
          className="absolute touch-none cursor-move"
          style={{ left: box.x, top: box.y, width: box.width, aspectRatio }}
          onPointerDown={(e) => iniciarArraste(e, "mover")}
          onPointerMove={mover}
          onPointerUp={pararArraste}
        >
          <div
            className="w-full h-full"
            style={
              molduraColor
                ? { background: molduraColor, padding: "3.2%" }
                : undefined
            }
          >
            {imagemUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagemUrl}
                alt="Prévia do quadro"
                className="w-full h-full object-cover block pointer-events-none"
                draggable={false}
              />
            ) : (
              <div
                className="w-full h-full pointer-events-none"
                style={{
                  background: `radial-gradient(120% 90% at 30% 20%, hsl(${hue} 45% 92%) 0%, hsl(${hue} 55% 62%) 45%, hsl(${hue} 62% 28%) 100%)`,
                }}
              />
            )}
          </div>

          <div
            className="absolute -right-3 -bottom-3 w-7 h-7 bg-white border border-black touch-none"
            onPointerDown={(e) => iniciarArraste(e, "redimensionar")}
            onPointerMove={mover}
            onPointerUp={pararArraste}
            aria-label="Redimensionar"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-white text-black px-6 py-3 text-[16px] tracking-artu"
      >
        FECHAR ✕
      </button>

      {!erro && (
        <p className="absolute bottom-8 left-0 right-0 text-center text-white text-[16px] tracking-artu px-4">
          ARRASTE PARA POSICIONAR · USE O CANTO PARA REDIMENSIONAR
        </p>
      )}
    </div>
  );
}
