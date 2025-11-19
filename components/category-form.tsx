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

interface CategoryFormProps {
  editingId: string | null
  onClose: () => void
}

const ICON_OPTIONS = ["🍔", "🚗", "🎬", "🛍️", "💡", "🏥", "📚", "✈️", "🎮", "🏠", "💼", "🍕"]
const COLOR_OPTIONS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#95E1D3",
  "#A8E6CF",
  "#FF8B94",
  "#A8D8EA",
  "#AA96DA",
  "#FCBAD3",
  "#FFFFD2",
]

export function CategoryForm({ editingId, onClose }: CategoryFormProps) {
  const { categories, addCategory, updateCategory } = useExpenseStore()
  const [formData, setFormData] = useState({
    name: "",
    icon: "📌",
    color: "#FF6B6B",
  })

  useEffect(() => {
    if (editingId) {
      const category = categories.find((c) => c.id === editingId)
      if (category) {
        setFormData({
          name: category.name,
          icon: category.icon,
          color: category.color,
        })
      }
    }
  }, [editingId, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    if (editingId) {
      updateCategory(editingId, {
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
      })
    } else {
      addCategory({
        name: formData.name,
        icon: formData.icon,
        color: formData.color,
      })
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingId ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {editingId ? "Update your category details" : "Create a new expense category"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Category Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Groceries"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Icon</label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                    formData.icon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-10 rounded-lg border-2 transition-all ${
                    formData.color === color ? "border-foreground scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Update" : "Add"} Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
