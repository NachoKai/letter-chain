import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "LetterChain - Word Chain Typing Game",
  description:
    "A fast-paced word chain game. Type Spanish words where each word starts with the last letter of the previous word!",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#1a1d23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
