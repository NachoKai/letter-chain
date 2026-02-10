import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    "A fast-paced word chain game. Type words where each word starts with the last two letters of the previous word!",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LetterChain",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "LetterChain",
    title: "LetterChain - Word Chain Typing Game",
    description:
      "A fast-paced word chain game. Type words where each word starts with the last two letters of the previous word!",
  },
  twitter: {
    card: "summary",
    title: "LetterChain - Word Chain Typing Game",
    description:
      "A fast-paced word chain game. Type words where each word starts with the last two letters of the previous word!",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1d23",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      <body className="font-sans antialiased min-h-screen bg-background text-foreground touch-manipulation">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered:', registration))
                    .catch(error => console.log('SW registration failed:', error));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
