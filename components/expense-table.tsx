"use client"

import type { Expense } from "@/lib/store"
import { useExpenseStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, ImageIcon } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit: (id: string) => void
}

export function ExpenseTable({ expenses, onEdit }: ExpenseTableProps) {
  const { categories, deleteExpense } = useExpenseStore()
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null)

  const getCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ")
  }

  const getCategoryIcons = (categoryIds: string[]) => {
    return categoryIds.map((id) => categories.find((c) => c.id === id)?.icon).filter(Boolean)
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No expenses found. Start by adding one!</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Categories</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-border hover:bg-secondary transition-colors duration-150">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-foreground">{expense.title}</p>
                    {expense.description && <p className="text-sm text-muted-foreground">{expense.description}</p>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 flex-wrap">
                    {getCategoryIcons(expense.categoryIds || []).map((icon, idx) => (
                      <span key={idx} className="text-lg">
                        {icon}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-foreground">{getCategoryNames(expense.categoryIds || [])}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-foreground">₹{expense.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-foreground">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {expense.images && expense.images.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedImages(expense.images || [])}
                        className="gap-1"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {expense.images.length}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => onEdit(expense.id)} className="gap-1">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteExpense(expense.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImages && (
        <Dialog open={!!selectedImages} onOpenChange={() => setSelectedImages(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Expense Images</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {selectedImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img || "/placeholder.svg"}
                  alt={`Expense ${idx}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
