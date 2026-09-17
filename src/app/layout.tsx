import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { obterSessao } from "@/lib/session";

export const metadata: Metadata = {
  title: "Galeria Sacra",
  description:
    "Galeria Sacra — arte sacra contemporânea. Quadros religiosos prontos ou totalmente personalizados, do seu jeito.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sessao = await obterSessao();

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AnnouncementBar>
            Frete grátis para compras acima de R$ 400 — em até 12x sem juros
          </AnnouncementBar>
          <Nav sessao={sessao} />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
