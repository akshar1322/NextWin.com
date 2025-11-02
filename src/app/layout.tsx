// app/layout.tsx
import './globals.css'
import LenisProvider from "../providers/LenisProvider"
import type { ReactNode } from "react"
import Providers from "../providers/providers"
import { poppins } from '@/lib/fonts' // Import the specific font

export const metadata = {
  title: "Next Win",
  description: "A Next win",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>
          <LenisProvider>{children}</LenisProvider>
        </Providers>
      </body>
    </html>
  )
}
