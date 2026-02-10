import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// IMPORTAMOS EL TEMA GLOBAL
import "../src/styles/theme.css";

// IMPORTAMOS TUS ESTILOS GLOBALES
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
  title: "COTECIA LIVE",
  description: "Live streaming vertical",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
