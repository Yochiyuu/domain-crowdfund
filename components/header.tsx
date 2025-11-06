"use client"

import Link from "next/link"
import { Rocket, Home, Coins } from "lucide-react"
import { LoginButton, useActiveAccount, liskSepolia } from "panna-sdk"
import { Button } from "@/components/ui/button"

export default function Header() {
  const activeAccount = useActiveAccount()
  const isConnected = !!activeAccount

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 animate-slide-in-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Domain</h1>
              <p className="text-xs text-muted-foreground">Decentralized Crowdfunding</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/crowdfund" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Lihat Proyek
            </Link>
          </Button>
          <div className="pl-4">
            <LoginButton chain={liskSepolia} />
          </div>
        </nav>
      </div>
    </header>
  )
}