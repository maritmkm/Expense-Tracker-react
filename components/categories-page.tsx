"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useExpenseStore } from "@/lib/store"
import { CategoryForm } from "./category-form"
import { Plus, Trash2, Edit2, Search } from "lucide-react"

export function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { categories, expenses, deleteCategory } = useExpenseStore()

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryExpenses = expenses.filter((e) => e.categoryId === category.id)
      const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      return {
        ...category,
        expenseCount: categoryExpenses.length,
        totalSpent,
        avgExpense: categoryExpenses.length > 0 ? totalSpent / categoryExpenses.length : 0,
      }
    })
  }, [categories, expenses])

  const filteredCategories = useMemo(() => {
    return categoryStats.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [categoryStats, searchTerm])

  const sortedCategories = [...filteredCategories].sort((a, b) => b.totalSpent - a.totalSpent)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage your expense categories</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-muted-foreground">{category.color}</span>
              </div>

              <div className="space-y-2 py-3 border-y border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-semibold text-foreground">₹{category.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expenses</span>
                  <span className="font-semibold text-foreground">{category.expenseCount}</span>
                </div>
                {category.expenseCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average</span>
                    <span className="font-semibold text-foreground">₹{category.avgExpense.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(category.id)
                    setIsFormOpen(true)
                  }}
                  className="flex-1 gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteCategory(category.id)}
                  className="flex-1 gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No categories found. Create one to get started!</p>
        </div>
      )}

      {isFormOpen && (
        <CategoryForm
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
