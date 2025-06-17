"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <div className="container flex items-center justify-end h-16 px-4 mx-auto">
          <ThemeToggle />
        </div>
      <main className="flex items-center justify-center flex-1 p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
} 