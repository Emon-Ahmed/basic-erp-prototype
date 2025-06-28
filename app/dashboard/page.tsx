"use client"

import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingCart, Factory, AlertTriangle, Clock, Plus, FileText } from "lucide-react"

const chartData = [
  { month: "Jan", orders: 65 },
  { month: "Feb", orders: 59 },
  { month: "Mar", orders: 80 },
  { month: "Apr", orders: 81 },
  { month: "May", orders: 56 },
  { month: "Jun", orders: 55 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { orders, inventory, productionTasks, employees } = useData()

  // Calculate statistics with proper null checks and default values
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((o) => o.status === "pending")?.length || 0
  const lowStockItems = inventory?.filter((i) => i.quantity <= i.minStock)?.length || 0
  const activeProductions = productionTasks?.filter((p) => p.status !== "done")?.length || 0

  const recentOrders = orders?.slice(0, 5) || []
  const lowStockAlerts = inventory?.filter((i) => i.quantity <= i.minStock)?.slice(0, 3) || []

  const recentActivity = [
    { id: 1, action: "New order received", details: "Fashion Retail Co. - $2,500", time: "2 hours ago", type: "order" },
    {
      id: 2,
      action: "Low stock alert",
      details: "Cotton Fabric - 45 units remaining",
      time: "4 hours ago",
      type: "alert",
    },
    {
      id: 3,
      action: "Production completed",
      details: "T-shirt cutting task finished",
      time: "6 hours ago",
      type: "production",
    },
    {
      id: 4,
      action: "New employee added",
      details: "Lisa Seamstress joined Production team",
      time: "1 day ago",
      type: "employee",
    },
  ]

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "worker"]}>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your business.</p>
            </div>
            {(user?.role === "admin" || user?.role === "manager") && (
              <div className="flex gap-2">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Order
                </Button>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  Reports
                </Button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Need reordering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Productions</CardTitle>
                <Factory className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProductions}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Orders Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
                <CardDescription>Order volume over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "order"
                            ? "bg-blue-500"
                            : activity.type === "alert"
                              ? "bg-red-500"
                              : activity.type === "production"
                                ? "bg-green-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.details}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders and Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.items.join(", ")}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "production"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need reordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockAlerts.length > 0 ? (
                    lowStockAlerts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-600">
                            {item.quantity} / {item.minStock}
                          </p>
                          <p className="text-xs text-gray-500">units</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">All items are well stocked!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button>Add New Order</Button>
                  <Button variant="outline">Manage Inventory</Button>
                  <Button variant="outline">View Reports</Button>
                  <Button variant="outline">Add Employee</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
