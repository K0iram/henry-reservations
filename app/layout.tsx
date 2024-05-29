import './globals.css'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Nav from '@/components/Nav'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Henry Reservations',
  description: 'Reservations made easy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased pt-14",
          fontSans.variable
        )}
      >
        <Nav />
        {children}
      </body>
    </html>
  )
}

