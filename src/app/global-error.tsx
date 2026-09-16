"use client";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ padding: 32, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
          <h2 style={{ fontSize: 24 }}>Algo deu errado.</h2>
          <button type="button" onClick={() => retry()} style={{ textDecoration: "underline" }}>
            TENTAR NOVAMENTE
          </button>
        </div>
      </body>
    </html>
  );
}
