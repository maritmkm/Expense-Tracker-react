"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useExpenseStore } from "@/lib/store"
import { X, Upload, Camera } from "lucide-react"

interface ExpenseFormProps {
  editingId: string | null
  onClose: () => void
}

export function ExpenseForm({ editingId, onClose }: ExpenseFormProps) {
  const { expenses, categories, addExpense, updateExpense } = useExpenseStore()
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    categoryIds: [] as string[], // Changed to array for multiple categories
    description: "",
    images: [] as string[], // Added images array
  })
  const [imagePreview, setImagePreview] = useState<string[]>([])

  useEffect(() => {
    if (editingId) {
      const expense = expenses.find((e) => e.id === editingId)
      if (expense) {
        setFormData({
          title: expense.title,
          amount: expense.amount.toString(),
          date: expense.date,
          categoryIds: expense.categoryIds || [], // Handle multiple categories
          description: expense.description || "",
          images: expense.images || [],
        })
        setImagePreview(expense.images || [])
      }
    }
  }, [editingId, expenses])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, base64],
          }))
          setImagePreview((prev) => [...prev, base64])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.amount || formData.categoryIds.length === 0) return

    if (editingId) {
      updateExpense(editingId, {
        title: formData.title,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        categoryIds: formData.categoryIds, // Updated to use categoryIds
        description: formData.description,
        images: formData.images,
      })
    } else {
      addExpense({
        title: formData.title,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        categoryIds: formData.categoryIds, // Updated to use categoryIds
        description: formData.description,
        images: formData.images,
      })
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? "Edit Expense" : "Add New Expense"}</DialogTitle>
          <DialogDescription>
            {editingId ? "Update your expense details" : "Create a new expense record"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Expense title"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Categories (Select one or more)</label>
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-3 bg-background/50">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.categoryIds.includes(cat.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Attach Images (Optional)</label>
            <div className="flex gap-2 mb-3">
              <label className="flex-1">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  capture="environment"
                />
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload from gallery</span>
                </div>
              </label>
              <label className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" capture="user" />
                <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <span className="text-sm">Take photo</span>
                </div>
              </label>
            </div>

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {imagePreview.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Preview ${idx}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Update" : "Add"} Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
