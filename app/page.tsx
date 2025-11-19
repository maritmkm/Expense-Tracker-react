"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { ExpensesPage } from "@/components/expenses-page"
import { CategoriesPage } from "@/components/categories-page"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

type Page = "dashboard" | "expenses" | "categories"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "expenses" && <ExpensesPage />}
          {currentPage === "categories" && <CategoriesPage />}
        </main>
      </div>
    </div>
  )
}
