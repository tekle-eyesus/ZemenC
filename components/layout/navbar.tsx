"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <nav className="sticky p-3 top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* <Calendar className="h-6 w-6" /> */}
            <img src="/nav-logo.png" alt="ZemenConverter" className="h-10 w-10" />
            <span className="hidden font-bold sm:inline-block text-lg">
              ZemenConverter
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other nav items here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Sign Up</Button>
          </nav>
        </div>
      </div>
    </nav>
  )
} 