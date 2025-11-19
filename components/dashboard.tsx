"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenseStore } from "@/lib/store"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react'

export function Dashboard() {
  const { expenses, categories } = useExpenseStore()
  
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [dateError, setDateError] = useState<string>("")

  const handleFromDateChange = (value: string) => {
    setFromDate(value)
    setDateError("")
    if (toDate && value > toDate) {
      setDateError("From Date must be before To Date")
    }
  }

  const handleToDateChange = (value: string) => {
    setToDate(value)
    setDateError("")
    if (fromDate && value < fromDate) {
      setDateError("To Date must be after From Date")
    }
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expenseDate = e.date
      const isAfterFromDate = !fromDate || expenseDate >= fromDate
      const isBeforeToDate = !toDate || expenseDate <= toDate
      return isAfterFromDate && isBeforeToDate
    })
  }, [expenses, fromDate, toDate])

  const stats = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    const monthlyExpenses = filteredExpenses
      .filter((e) => {
        const date = new Date(e.date)
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear
      })
      .reduce((sum, e) => sum + e.amount, 0)

    const categoryData = categories.map((cat) => {
      const amount = filteredExpenses
        .filter((e) => e.categoryIds.includes(cat.id))
        .reduce((sum, e) => sum + e.amount, 0)
      return { name: cat.name, value: amount, color: cat.color }
    })

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(thisYear, i, 1).toLocaleString("default", { month: "short" })
      const amount = filteredExpenses
        .filter((e) => {
          const date = new Date(e.date)
          return date.getMonth() === i && date.getFullYear() === thisYear
        })
        .reduce((sum, e) => sum + e.amount, 0)
      return { month, amount }
    })

    return { totalExpenses, monthlyExpenses, categoryData, monthlyData }
  }, [filteredExpenses, categories])

  return (
    <div className="p-8 space-y-8">
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Date Range Filter</h3>
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("")
                setToDate("")
                setDateError("")
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => handleToDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {dateError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-600 dark:text-red-400">{dateError}</span>
          </div>
        )}

        {/* Display active filter info */}
        {(fromDate || toDate) && !dateError && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {fromDate && toDate ? (
              <p>Showing expenses from {fromDate} to {toDate} ({filteredExpenses.length} expenses)</p>
            ) : fromDate ? (
              <p>Showing expenses from {fromDate} onwards ({filteredExpenses.length} expenses)</p>
            ) : (
              <p>Showing expenses up to {toDate} ({filteredExpenses.length} expenses)</p>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeIn">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {fromDate || toDate ? "Selected range" : "All time"}
            </p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current month</p>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {filteredExpenses.length > 0
                ? (
                    stats.monthlyExpenses / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                  ).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per day</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slideInUp">
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Expenses over the year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card
          className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slideInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card
        className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slideInUp"
        style={{ animationDelay: "0.2s" }}
      >
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed view of expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
