"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Search, ShoppingCart, Printer } from "lucide-react"

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "production" | "completed">("all")

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "production":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (orderId: string, newStatus: "pending" | "production" | "completed") => {
    updateOrderStatus(orderId, newStatus)
  }

  const handlePrintInvoice = (order: any) => {
    // Mock print function - in real app, this would generate a PDF
    const printContent = `
      INVOICE
      --------
      Customer: ${order.customer}
      Order ID: ${order.id}
      Date: ${order.createdAt}
      
      Items:
      ${order.items.map((item: any) => `- ${item.name}: ${item.quantity}`).join("\n")}
      
      Status: ${order.status.toUpperCase()}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Invoice - ${order.id}</title></head>
          <body style="font-family: monospace; white-space: pre-line; padding: 20px;">
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600">Track and manage customer orders</p>
              </div>
              <Link href="/orders/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="production">Production</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Orders ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {order.items.map((item, index) => (
                              <div key={index}>
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">{order.createdAt}</td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="production">Production</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handlePrintInvoice(order)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
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
