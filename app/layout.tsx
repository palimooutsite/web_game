import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RPG Nusantara Interaktif",
  description: "Web game RPG interaktif dengan Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
