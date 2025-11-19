"use client"

import { LayoutDashboard, Wallet, Tag, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useExpenseStore } from "@/lib/store"

interface SidebarProps {
  currentPage: "dashboard" | "expenses" | "categories"
  onPageChange: (page: "dashboard" | "expenses" | "categories") => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const { expenses } = useExpenseStore()

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthlyExpenses = expenses
    .filter((e) => {
      const date = new Date(e.date)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "expenses", label: "Expenses", icon: Wallet },
    { id: "categories", label: "Categories", icon: Tag },
  ] as const

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">ExpenseTrack</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your finances</p>
        </div>

        {/* Quick Stats */}
        <div className="p-4 space-y-3 border-b border-border">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-lg font-bold text-foreground">₹{monthlyExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold text-foreground">₹{totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  currentPage === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-secondary",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">© 2025 ExpenseTrack</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
