"use client"

import { useState } from "react"
import Layout from "../../components/Layout"
import { useData } from "../../contexts/DataContext"
import { PlusIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline"

export default function Orders() {
  const { orders, addOrder, updateOrderStatus } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer: "",
    items: [{ name: "", qty: "" }],
    dueDate: "",
    total: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...formData,
      items: formData.items.map((item) => ({ ...item, qty: Number.parseInt(item.qty) })),
      total: Number.parseFloat(formData.total),
    }
    addOrder(orderData)
    setFormData({
      customer: "",
      items: [{ name: "", qty: "" }],
      dueDate: "",
      total: "",
    })
    setShowForm(false)
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", qty: "" }],
    })
  }

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const exportToPDF = (order) => {
    // Mock PDF export function
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.customer}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TexTrack ERP</h1>
            <h2>Invoice</h2>
          </div>
          <div class="invoice-details">
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${order.orderDate}</p>
            <p><strong>Due Date:</strong> ${order.dueDate}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: $${order.total}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-800"
      case "Production":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout currentPage="/orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Track and manage customer orders</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Order
          </button>
        </div>

        {/* Order status pipeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Pipeline</h3>
          <div className="flex space-x-8">
            {["Pending", "Production", "Completed"].map((status, index) => {
              const count = orders.filter((order) => order.status === status).length
              return (
                <div key={status} className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      status === "Pending"
                        ? "bg-gray-100 text-gray-800"
                        : status === "Production"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {count}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{status}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.items.map((item) => `${item.name} (${item.qty})`).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Production">Production</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => exportToPDF(order)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create order form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Order</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        required
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={item.qty}
                        onChange={(e) => updateItem(index, "qty", e.target.value)}
                        className="w-24 border border-gray-300 rounded-md px-3 py-2"
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addItem} className="text-blue-600 hover:text-blue-800 text-sm">
                    + Add Item
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        customer: "",
                        items: [{ name: "", qty: "" }],
                        dueDate: "",
                        total: "",
                      })
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
