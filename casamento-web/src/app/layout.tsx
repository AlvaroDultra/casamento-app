import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { wedding } from "@/config/wedding";
import "./globals.css";

export const metadata: Metadata = {
  title: `${wedding.coupleNames} | Nosso Casamento`,
  description: wedding.welcomeMessage,
};

// Converte "#b08d57" em "176 141 87" (canais p/ opacidade do Tailwind)
function hexToRgbChannels(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

// Injeta o tema do casamento (config/wedding.ts) como CSS variables globais
const { primary, primaryDark, accent } = wedding.theme;
const themeStyle = `:root {
  --color-primary: ${primary};
  --color-primary-dark: ${primaryDark};
  --color-accent: ${accent};
  --color-primary-rgb: ${hexToRgbChannels(primary)};
  --color-primary-dark-rgb: ${hexToRgbChannels(primaryDark)};
  --color-accent-rgb: ${hexToRgbChannels(accent)};
  --font-display: ${wedding.fontDisplay};
  --font-body: ${wedding.fontBody};
}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#fffdf8",
              color: "#2b2620",
              border: "1px solid rgba(176,141,87,0.25)",
              borderRadius: "9999px",
              fontSize: "0.85rem",
            },
          }}
        />
      </body>
    </html>
  );
}
