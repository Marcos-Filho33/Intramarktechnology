import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntraMark Technology | Catálogo inteligente de serviços",
  description:
    "Site moderno e responsivo da IntraMark Technology com catálogo inteligente de serviços e envio automático para WhatsApp.",
  keywords: [
    "IntraMark",
    "tecnologia",
    "desenvolvimento de software",
    "automação",
    "IA",
    "sites",
    "WhatsApp",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
