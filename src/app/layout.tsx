import "./globals.css";
import LenisProvider from "../components/providers/LenisProvider";
import type { ReactNode } from "react";
import { Poppins, Inter, Space_Mono } from "next/font/google";

// Heading font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

// Body font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

// Monospace font
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata = {
  title: "Next Win",
  description: "A Next win",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
