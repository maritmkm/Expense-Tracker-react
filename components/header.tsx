"use client"

import { Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Track and manage your expenses</p>
      </div>
      <div className="flex items-center gap-4 relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-full w-10 h-10 p-0"
        >
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
            U
          </div>
        </Button>

        {showMenu && (
          <div className="absolute right-0 top-12 bg-card border border-border rounded-lg shadow-lg overflow-hidden w-48">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-secondary transition-colors border-t border-border">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
