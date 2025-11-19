"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useExpenseStore } from "@/lib/store"
import { ExpenseForm } from "./expense-form"
import { ExpenseTable } from "./expense-table"
import { Plus, Search, Download } from "lucide-react"

export function ExpensesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "title">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { expenses } = useExpenseStore()

  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter(
      (e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (startDate) {
      filtered = filtered.filter((e) => new Date(e.date) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter((e) => new Date(e.date) <= new Date(endDate))
    }

    filtered.sort((a, b) => {
      let compareValue = 0
      if (sortBy === "date") {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === "amount") {
        compareValue = a.amount - b.amount
      } else if (sortBy === "title") {
        compareValue = a.title.localeCompare(b.title)
      }
      return sortOrder === "asc" ? compareValue : -compareValue
    })

    return filtered
  }, [expenses, searchTerm, startDate, endDate, sortBy, sortOrder])

  const handleExport = () => {
    const headers = ["Title", "Category", "Amount", "Date", "Description"]
    const rows = filteredExpenses.map((e) => [e.title, e.categoryId, e.amount, e.date, e.description || ""])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your expenses</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>View and manage your expense records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "title")}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={(id) => {
              setEditingId(id)
              setIsFormOpen(true)
            }}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <ExpenseForm
          editingId={editingId}
          onClose={() => {
            setIsFormOpen(false)
            setEditingId(null)
          }}
        />
      )}
    </div>
  )
}
