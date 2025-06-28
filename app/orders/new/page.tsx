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
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  name: string
  quantity: number
}

export default function NewOrderPage() {
  const { addOrder } = useData()
  const router = useRouter()
  const [customer, setCustomer] = useState("")
  const [items, setItems] = useState<OrderItem[]>([{ name: "", quantity: 1 }])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customer && items.some((item) => item.name)) {
      const validItems = items.filter((item) => item.name && item.quantity > 0)
      addOrder({
        customer,
        items: validItems,
        status: "pending",
      })
      router.push("/orders")
    }
  }

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setItems(updatedItems)
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <Link href="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
            <p className="text-gray-600">Add a new customer order to the system</p>
          </div>

          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <Input
                    id="customer"
                    type="text"
                    required
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="e.g., ABC Fashion Store"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">Order Items *</label>
                    <Button type="button" onClick={addItem} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                          <Input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                            placeholder="e.g., T-Shirt, Jeans, Dress"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <Input
                            type="number"
                            required
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                          />
                        </div>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Order
                  </Button>
                  <Link href="/orders">
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
