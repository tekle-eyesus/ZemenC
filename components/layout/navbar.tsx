"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl p-2 sm:p-0">
        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/nav-logo.png" alt="ZemenConverter" className="w-10 h-10" />
              <span className="text-xl font-bold">ZemenConverter</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
                <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile layout */}
        <div className="flex sm:hidden flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/nav-logo.png" alt="ZemenConverter" className="w-8 h-8" />
              <span className="text-lg font-bold">ZemenConverter</span>
            </Link>
            <div className="flex items-center gap-2">
              {user ? (
                <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
} 