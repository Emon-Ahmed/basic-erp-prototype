"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewInventoryPage() {
  const { addInventoryItem } = useData()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    threshold: "",
    unit: "",
    category: "fabric" as "fabric" | "buttons" | "zippers" | "other",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addInventoryItem({
      name: formData.name,
      quantity: Number.parseInt(formData.quantity),
      threshold: Number.parseInt(formData.threshold),
      unit: formData.unit,
      category: formData.category,
    })
    router.push("/inventory")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <Link href="/inventory" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Add New Inventory Item</h1>
            <p className="text-gray-600">Add a new material or supply to your inventory</p>
          </div>

          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Cotton Fabric"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fabric">Fabric</option>
                    <option value="buttons">Buttons</option>
                    <option value="zippers">Zippers</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Quantity *
                    </label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <Input
                      id="unit"
                      name="unit"
                      type="text"
                      required
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="e.g., yard, piece, kg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold *
                  </label>
                  <Input
                    id="threshold"
                    name="threshold"
                    type="number"
                    required
                    min="0"
                    value={formData.threshold}
                    onChange={handleChange}
                    placeholder="Minimum quantity before alert"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You'll receive an alert when quantity falls below this number
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Add Item
                  </Button>
                  <Link href="/inventory">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
