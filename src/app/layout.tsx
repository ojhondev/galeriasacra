import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CadastroPopup } from "@/components/CadastroPopup";
import { AvisoWhatsappBar } from "@/components/AvisoWhatsappBar";
import { obterSessao } from "@/lib/session";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-redhat",
});

export const metadata: Metadata = {
  title: "Galeria Sacra",
  description:
    "Galeria Sacra — arte sacra contemporânea. Quadros religiosos prontos ou totalmente personalizados, do seu jeito.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const sessao = await obterSessao();

  return (
    <html lang="pt-BR" className={`h-full antialiased ${redHatDisplay.variable}`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <AnnouncementBar>
            Frete grátis para compras acima de R$ 400 — em até 12x sem juros
          </AnnouncementBar>
          <Nav sessao={sessao} />
          <main className="flex-1 pb-[64px] md:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomNav sessao={sessao} />
          <AvisoWhatsappBar />
          <CadastroPopup />
        </CartProvider>
      </body>
    </html>
  );
}
