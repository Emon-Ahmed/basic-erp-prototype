"use client"

import { useEffect, useRef } from "react"
import Layout from "../../components/Layout"
import { useData } from "../../contexts/DataContext"
import { useAuth } from "../../contexts/AuthContext"
import Chart from "chart.js/auto"

export default function Dashboard() {
  const { inventory, orders } = useData()
  const { user } = useAuth()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // Calculate dashboard stats
  const totalOrders = orders.length
  const lowStockItems = inventory.filter((item) => item.quantity < item.threshold).length
  const activeProductions = orders.filter((order) => order.status === "Production").length
  const completedOrders = orders.filter((order) => order.status === "Completed").length

  // Mock monthly orders data
  const monthlyOrdersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Orders",
        data: [12, 19, 8, 15, 22, 18],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: monthlyOrdersData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Monthly Orders",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const stats = [
    { name: "Total Orders", value: totalOrders, color: "bg-blue-500" },
    { name: "Low Stock Items", value: lowStockItems, color: "bg-red-500" },
    { name: "Active Productions", value: activeProductions, color: "bg-yellow-500" },
    { name: "Completed Orders", value: completedOrders, color: "bg-green-500" },
  ]

  return (
    <Layout currentPage="/dashboard">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your garment factory today.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart and quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <canvas ref={chartRef} width="400" height="200"></canvas>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {user?.role !== "worker" && (
                <>
                  <a
                    href="/orders"
                    className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <div className="font-medium text-blue-900">Create New Order</div>
                    <div className="text-sm text-blue-700">Add a new customer order</div>
                  </a>
                  <a
                    href="/inventory"
                    className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                  >
                    <div className="font-medium text-green-900">Add Inventory Item</div>
                    <div className="text-sm text-green-700">Stock new materials</div>
                  </a>
                </>
              )}
              <a
                href="/production"
                className="block w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors"
              >
                <div className="font-medium text-yellow-900">View Production Board</div>
                <div className="text-sm text-yellow-700">Track production progress</div>
              </a>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-500">
                    {order.items.map((item) => `${item.name} (${item.qty})`).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Production"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">${order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
