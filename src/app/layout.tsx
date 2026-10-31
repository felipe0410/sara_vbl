import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { IconSprite } from "@/components/icons";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sara-balaguera.web.app"),
  title: "Sara Valentina · Creadora de contenido",
  description:
    "Sara Valentina — creadora de contenido de beauty, fashion, lifestyle y western chic. Bogotá, Boyacá y Llanos Orientales.",
  openGraph: {
    title: "Sara Valentina · Creadora de contenido",
    description: "Beauty, fashion, lifestyle y western chic con estética editorial. Bogotá, Colombia.",
    images: ["/img/cover.jpg"],
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5B0D24",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <IconSprite />
        {children}
      </body>
    </html>
  );
}
