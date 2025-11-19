import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  date: string
  categoryIds: string[] // Changed from single categoryId to array of categoryIds
  description?: string
  images?: string[] // Added images array to store base64 encoded images
}

interface ExpenseStore {
  expenses: Expense[]
  categories: Category[]
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  addCategory: (category: Omit<Category, "id">) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

const defaultCategories: Category[] = [
  { id: "1", name: "Food", color: "#FF6B6B", icon: "🍔" },
  { id: "2", name: "Transport", color: "#4ECDC4", icon: "🚗" },
  { id: "3", name: "Entertainment", color: "#FFE66D", icon: "🎬" },
  { id: "4", name: "Shopping", color: "#95E1D3", icon: "🛍️" },
  { id: "5", name: "Utilities", color: "#A8E6CF", icon: "💡" },
]

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      categories: defaultCategories,
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: Date.now().toString() }],
        })),
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: Date.now().toString() }],
        })),
      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          expenses: state.expenses.map((e) => ({
            ...e,
            categoryIds: e.categoryIds.filter((cid) => cid !== id),
          })),
        })),
    }),
    {
      name: "expense-store",
    },
  ),
)
