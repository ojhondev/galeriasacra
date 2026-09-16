import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { obterSessao } from "@/lib/session";

export const metadata: Metadata = {
  title: "Artusa",
  description:
    "Artusa — arte sacra contemporânea. Quadros religiosos prontos ou totalmente personalizados, do seu jeito.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sessao = await obterSessao();

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Nav sessao={sessao} />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
