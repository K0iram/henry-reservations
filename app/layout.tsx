import './globals.css'
import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Nav from '@/components/Nav'
import { Toaster } from '@/components/ui/toaster'
import { ReservationsProvider } from '@/lib/context/ReservationsContext'

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
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Nav />
        <Toaster />
        <ReservationsProvider>
          {children}
        </ReservationsProvider>
      </body>
    </html>
  )
}

