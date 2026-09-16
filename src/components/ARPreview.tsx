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

const TUTORIAL_KEY = "artusa:ar-tutorial-visto";

const PASSOS_TUTORIAL = [
  {
    titulo: "1. Aponte a câmera",
    texto: "Vire o celular para a parede onde você imagina o quadro pendurado.",
  },
  {
    titulo: "2. Posicione e gire",
    texto:
      "Arraste com um dedo para mover o quadro. Use dois dedos (pinça) para ajustar o tamanho e girar, encaixando no ângulo da parede.",
  },
  {
    titulo: "3. Tire a foto",
    texto: "Quando estiver satisfeito, toque no botão de câmera para salvar a foto.",
  },
];

function distanciaEAngulo(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { distancia: Math.hypot(dx, dy), angulo: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function desenharComCover(
  ctx: CanvasRenderingContext2D,
  fonte: CanvasImageSource,
  fonteW: number,
  fonteH: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const fonteAspect = fonteW / fonteH;
  const destAspect = dw / dh;
  let sx = 0;
  let sy = 0;
  let sWidth = fonteW;
  let sHeight = fonteH;

  if (fonteAspect > destAspect) {
    sHeight = fonteH;
    sWidth = fonteH * destAspect;
    sx = (fonteW - sWidth) / 2;
  } else {
    sWidth = fonteW;
    sHeight = fonteW / destAspect;
    sy = (fonteH - sHeight) / 2;
  }

  ctx.drawImage(fonte, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
}

export function ARPreview({ aspectRatio, hue, molduraColor, imagemUrl, onClose }: ARPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [rotacao, setRotacao] = useState(0);
  const [tutorialPasso, setTutorialPasso] = useState<number | null>(() => {
    try {
      return window.localStorage.getItem(TUTORIAL_KEY) ? null : 0;
    } catch {
      return 0;
    }
  });
  const [capturando, setCapturando] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const boxRef = useRef(box);
  const rotacaoRef = useRef(rotacao);
  useEffect(() => {
    boxRef.current = box;
  }, [box]);
  useEffect(() => {
    rotacaoRef.current = rotacao;
  }, [rotacao]);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestoRef = useRef<
    | { modo: "mover"; startX: number; startY: number; box: Box }
    | { modo: "redimensionar"; startX: number; box: Box }
    | { modo: "pinca"; box: Box; rotacaoBase: number; distanciaInicial: number; anguloInicial: number }
    | null
  >(null);

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

  function fecharTutorial() {
    setTutorialPasso(null);
    try {
      window.localStorage.setItem(TUTORIAL_KEY, "1");
    } catch {
      // ignora storage indisponível
    }
  }

  function iniciarArrasteFrame(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1) {
      gestoRef.current = { modo: "mover", startX: e.clientX, startY: e.clientY, box: boxRef.current };
    } else if (pointersRef.current.size === 2) {
      const pontos = Array.from(pointersRef.current.values());
      const { distancia, angulo } = distanciaEAngulo(pontos[0], pontos[1]);
      gestoRef.current = {
        modo: "pinca",
        box: boxRef.current,
        rotacaoBase: rotacaoRef.current,
        distanciaInicial: distancia,
        anguloInicial: angulo,
      };
    }
  }

  function moverFrame(e: React.PointerEvent) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const gesto = gestoRef.current;
    if (!gesto) return;

    if (gesto.modo === "mover") {
      const dx = e.clientX - gesto.startX;
      const dy = e.clientY - gesto.startY;
      setBox({ ...gesto.box, x: gesto.box.x + dx, y: gesto.box.y + dy });
    } else if (gesto.modo === "pinca" && pointersRef.current.size === 2) {
      const pontos = Array.from(pointersRef.current.values());
      const { distancia, angulo } = distanciaEAngulo(pontos[0], pontos[1]);
      const escala = distancia / gesto.distanciaInicial;
      const alturaBase = gesto.box.width / aspectRatio;
      const cx = gesto.box.x + gesto.box.width / 2;
      const cy = gesto.box.y + alturaBase / 2;
      const novaLargura = Math.max(80, gesto.box.width * escala);
      const novaAltura = novaLargura / aspectRatio;

      setBox({ x: cx - novaLargura / 2, y: cy - novaAltura / 2, width: novaLargura });
      setRotacao(gesto.rotacaoBase + (angulo - gesto.anguloInicial));
    }
  }

  function pararFrame(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size === 1) {
      const [[, ponto]] = pointersRef.current;
      gestoRef.current = { modo: "mover", startX: ponto.x, startY: ponto.y, box: boxRef.current };
    } else if (pointersRef.current.size === 0) {
      gestoRef.current = null;
    }
  }

  function iniciarRedimensionar(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    gestoRef.current = { modo: "redimensionar", startX: e.clientX, box: boxRef.current };
  }

  function redimensionar(e: React.PointerEvent) {
    const gesto = gestoRef.current;
    if (!gesto || gesto.modo !== "redimensionar") return;
    const dx = e.clientX - gesto.startX;
    setBox({ ...gesto.box, width: Math.max(80, gesto.box.width + dx) });
  }

  function pararRedimensionar(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    gestoRef.current = null;
  }

  async function capturarFoto() {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    setCapturando(true);
    try {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      desenharComCover(ctx, video, video.videoWidth, video.videoHeight, 0, 0, cw, ch);

      const altura = box.width / aspectRatio;
      const cx = box.x + box.width / 2;
      const cy = box.y + altura / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotacao * Math.PI) / 180);
      ctx.translate(-box.width / 2, -altura / 2);

      let ix = 0;
      let iy = 0;
      let iw = box.width;
      let ih = altura;

      if (molduraColor) {
        ctx.fillStyle = molduraColor;
        ctx.fillRect(0, 0, box.width, altura);
        const pad = box.width * 0.032;
        ix = pad;
        iy = pad;
        iw = box.width - pad * 2;
        ih = altura - pad * 2;
      }

      if (imagemUrl) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = imagemUrl;
        });
        desenharComCover(ctx, img, img.naturalWidth, img.naturalHeight, ix, iy, iw, ih);
      } else {
        const gradiente = ctx.createRadialGradient(
          ix + iw * 0.3,
          iy + ih * 0.2,
          0,
          ix + iw * 0.3,
          iy + ih * 0.2,
          Math.max(iw, ih) * 0.9,
        );
        gradiente.addColorStop(0, `hsl(${hue} 45% 92%)`);
        gradiente.addColorStop(0.45, `hsl(${hue} 55% 62%)`);
        gradiente.addColorStop(1, `hsl(${hue} 62% 28%)`);
        ctx.fillStyle = gradiente;
        ctx.fillRect(ix, iy, iw, ih);
      }
      ctx.restore();

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob) setFotoUrl(URL.createObjectURL(blob));
    } finally {
      setCapturando(false);
    }
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black overflow-hidden">
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

      {!erro && (
        <div
          className="absolute touch-none cursor-move"
          style={{
            left: box.x,
            top: box.y,
            width: box.width,
            aspectRatio,
            transform: `rotate(${rotacao}deg)`,
          }}
          onPointerDown={iniciarArrasteFrame}
          onPointerMove={moverFrame}
          onPointerUp={pararFrame}
          onPointerCancel={pararFrame}
        >
          <div
            className="w-full h-full"
            style={molduraColor ? { background: molduraColor, padding: "3.2%" } : undefined}
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
            onPointerDown={iniciarRedimensionar}
            onPointerMove={redimensionar}
            onPointerUp={pararRedimensionar}
            onPointerCancel={pararRedimensionar}
            aria-label="Redimensionar"
          />
        </div>
      )}

      {!erro && (
        <>
          <button
            type="button"
            onClick={capturarFoto}
            disabled={capturando}
            aria-label="Tirar foto"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-black/20 disabled:opacity-50"
          />
          <p className="absolute bottom-[110px] left-0 right-0 text-center text-white text-[14px] tracking-artu px-4">
            ARRASTE PARA MOVER · PINÇA PARA GIRAR E REDIMENSIONAR
          </p>
        </>
      )}

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-white text-black px-6 py-3 text-[16px] tracking-artu"
      >
        FECHAR ✕
      </button>

      {tutorialPasso !== null && (
        <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center px-6">
          <div className="bg-white max-w-sm w-full p-8">
            <p className="text-[13px] tracking-artu text-black/50 mb-2">
              {tutorialPasso + 1} DE {PASSOS_TUTORIAL.length}
            </p>
            <p className="text-[22px] mb-3">{PASSOS_TUTORIAL[tutorialPasso].titulo}</p>
            <p className="text-[16px] leading-[1.3] mb-[24px]">{PASSOS_TUTORIAL[tutorialPasso].texto}</p>
            <div className="flex items-center justify-between">
              <button type="button" onClick={fecharTutorial} className="text-[14px] underline">
                PULAR
              </button>
              <button
                type="button"
                onClick={() =>
                  tutorialPasso + 1 < PASSOS_TUTORIAL.length
                    ? setTutorialPasso(tutorialPasso + 1)
                    : fecharTutorial()
                }
                className="bg-black text-white px-6 py-3 text-[14px] tracking-artu"
              >
                {tutorialPasso + 1 < PASSOS_TUTORIAL.length ? "PRÓXIMO" : "COMEÇAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {fotoUrl && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col">
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotoUrl} alt="Foto capturada" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex items-center justify-center gap-4 p-6">
            <button
              type="button"
              onClick={() => setFotoUrl(null)}
              className="border border-white text-white px-6 py-3 text-[16px] tracking-artu"
            >
              TIRAR OUTRA
            </button>
            <a
              href={fotoUrl}
              download="meu-quadro-artusa.png"
              className="bg-white text-black px-6 py-3 text-[16px] tracking-artu"
            >
              SALVAR FOTO
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
