"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center px-4">
      <ul className="flex gap-4 items-center">
        {children}
      </ul>
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  const isActive = pathname === props.href

  return (
    <Link
      {...props}
      className={cn(
        "text-sm font-medium transition-colors hover:text-brand-gold-500",
        isActive
          ? "text-brand-gold-500"
          : "text-foreground/60"
      )}
    />
  )
}