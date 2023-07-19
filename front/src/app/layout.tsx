// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '../providers/theme-provider'
import { ModalProvider } from '@/providers/modal-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-commerce CMS',
  description: 'E-commerce CMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
        <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            >
              <ModalProvider/>
          {children}
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  )
}
