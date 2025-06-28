"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Search, AlertTriangle, Package } from "lucide-react"

export default function InventoryPage() {
  const { inventory } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "category">("name")

  const filteredInventory = inventory
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "quantity") return b.quantity - a.quantity
      if (sortBy === "category") return a.category.localeCompare(b.category)
      return a.name.localeCompare(b.name)
    })

  const lowStockItems = inventory.filter((item) => item.quantity < item.threshold)

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600">Manage your materials and supplies</p>
              </div>
              <Link href="/inventory/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-2">{lowStockItems.length} items are running low on stock:</p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map((item) => (
                    <Badge key={item.id} variant="destructive">
                      {item.name} ({item.quantity} {item.unit})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "quantity" | "category")}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="quantity">Sort by Quantity</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory Items ({filteredInventory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Unit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Threshold</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-b hover:bg-gray-50 ${item.quantity < item.threshold ? "bg-red-50" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="capitalize">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className={item.quantity < item.threshold ? "text-red-600 font-semibold" : ""}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.unit}</td>
                        <td className="py-3 px-4">{item.threshold}</td>
                        <td className="py-3 px-4">
                          {item.quantity < item.threshold ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : item.quantity < item.threshold * 1.5 ? (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                              Warning
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              In Stock
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
