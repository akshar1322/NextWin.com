// lib/fonts.ts
import localFont from 'next/font/local'

// Export Poppins font configuration
export const poppins = localFont({
  src: [
    {
      path: '../fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Poppins/Poppins-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-poppins',
  display: 'swap',
})

// If you have multiple fonts, export them here too
export const dancingScript = localFont({
  src: [
    {
      path: '../fonts/DancingScript/DancingScript-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/DancingScript/DancingScript-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-dancing',
})
