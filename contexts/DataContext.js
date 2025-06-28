"use client"

import { createContext, useContext, useState } from "react"

const DataContext = createContext()

// Sample data
const SAMPLE_INVENTORY = [
  { id: 1, name: "Cotton Fabric", quantity: 150, threshold: 50, unit: "yard", category: "Fabric" },
  { id: 2, name: "Polyester Fabric", quantity: 200, threshold: 75, unit: "yard", category: "Fabric" },
  { id: 3, name: "Plastic Buttons", quantity: 30, threshold: 100, unit: "piece", category: "Accessories" },
  { id: 4, name: "Metal Zippers", quantity: 80, threshold: 50, unit: "piece", category: "Accessories" },
  { id: 5, name: "Thread - Black", quantity: 25, threshold: 30, unit: "spool", category: "Thread" },
  { id: 6, name: "Thread - White", quantity: 45, threshold: 30, unit: "spool", category: "Thread" },
]

const SAMPLE_ORDERS = [
  {
    id: 1,
    customer: "ABC Fashion",
    items: [{ name: "T-Shirt", qty: 200 }],
    status: "Production",
    orderDate: "2024-01-15",
    dueDate: "2024-02-15",
    total: 4000,
  },
  {
    id: 2,
    customer: "XYZ Retail",
    items: [{ name: "Jeans", qty: 150 }],
    status: "Pending",
    orderDate: "2024-01-20",
    dueDate: "2024-02-20",
    total: 7500,
  },
  {
    id: 3,
    customer: "Fashion Hub",
    items: [{ name: "Dress", qty: 100 }],
    status: "Completed",
    orderDate: "2024-01-10",
    dueDate: "2024-02-10",
    total: 5000,
  },
]

const SAMPLE_PRODUCTION = [
  { id: 1, orderId: 1, title: "T-Shirt Production - ABC Fashion", status: "Cutting", assignedTo: "worker@tex.com" },
  { id: 2, orderId: 2, title: "Jeans Production - XYZ Retail", status: "To Do", assignedTo: null },
  { id: 3, orderId: 3, title: "Dress Production - Fashion Hub", status: "Done", assignedTo: "worker@tex.com" },
]

export function DataProvider({ children }) {
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY)
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [production, setProduction] = useState(SAMPLE_PRODUCTION)

  // Inventory functions
  const addInventoryItem = (item) => {
    const newItem = { ...item, id: Date.now() }
    setInventory((prev) => [...prev, newItem])
  }

  const updateInventoryItem = (id, updates) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteInventoryItem = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id))
  }

  // Order functions
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      status: "Pending",
      orderDate: new Date().toISOString().split("T")[0],
    }
    setOrders((prev) => [...prev, newOrder])
  }

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  // Production functions
  const updateProductionStatus = (id, status) => {
    setProduction((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const assignWorker = (id, workerEmail) => {
    setProduction((prev) => prev.map((item) => (item.id === id ? { ...item, assignedTo: workerEmail } : item)))
  }

  return (
    <DataContext.Provider
      value={{
        inventory,
        orders,
        production,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addOrder,
        updateOrderStatus,
        updateProductionStatus,
        assignWorker,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
