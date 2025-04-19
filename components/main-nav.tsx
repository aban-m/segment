"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-blue-600"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span className="hidden font-bold sm:inline-block">ProConnect</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground font-semibold" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/browse"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/browse") ? "text-foreground font-semibold" : "text-foreground/60",
          )}
        >
          Browse
        </Link>
        <Link
          href="/connections"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/connections") ? "text-foreground font-semibold" : "text-foreground/60",
          )}
        >
          Connections
        </Link>
      </nav>
    </div>
  )
}
