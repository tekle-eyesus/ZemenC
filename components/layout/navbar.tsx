"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="sticky p-3 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-14 max-w-screen-2xl">
        <div className="flex mr-4">
          <Link href="/" className="flex items-center mr-6 space-x-2">
            {/* <Calendar className="w-6 h-6" /> */}
            <img src="/nav-logo.png" alt="ZemenConverter" className="w-10 h-10" />
            <span className="hidden text-lg font-bold sm:inline-block">
              ZemenConverter
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-between flex-1 space-x-2 md:justify-end">
          <div className="flex-1 w-full md:w-auto md:flex-none">
            {/* Add search or other nav items here */}
          </div>
          <nav className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.username}
                </span>
                <Button variant="outline" onClick={signOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </nav>
  )
} 