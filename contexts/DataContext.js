"use client"

import { createContext, useContext, useState } from "react"

const DataContext = createContext()

// Sample inventory data
const SAMPLE_INVENTORY = [
  { id: 1, name: "Cotton Fabric", category: "Fabric", quantity: 150, threshold: 50, unit: "yard" },
  { id: 2, name: "Polyester Thread", category: "Thread", quantity: 25, threshold: 30, unit: "spool" },
  { id: 3, name: "Buttons", category: "Accessories", quantity: 500, threshold: 100, unit: "piece" },
  { id: 4, name: "Zippers", category: "Accessories", quantity: 75, threshold: 25, unit: "piece" },
  { id: 5, name: "Denim Fabric", category: "Fabric", quantity: 200, threshold: 75, unit: "yard" },
]

// Sample orders data
const SAMPLE_ORDERS = [
  {
    id: 1001,
    customer: "Fashion Forward Inc.",
    items: [
      { name: "T-Shirts", qty: 100 },
      { name: "Jeans", qty: 50 },
    ],
    orderDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "Production",
    total: 2500.0,
  },
  {
    id: 1002,
    customer: "Style Co.",
    items: [{ name: "Dresses", qty: 75 }],
    orderDate: "2024-01-20",
    dueDate: "2024-02-20",
    status: "Pending",
    total: 1875.0,
  },
  {
    id: 1003,
    customer: "Urban Wear",
    items: [{ name: "Hoodies", qty: 60 }],
    orderDate: "2024-01-10",
    dueDate: "2024-02-10",
    status: "Completed",
    total: 1800.0,
  },
]

// Sample production data
const SAMPLE_PRODUCTION = [
  { id: 1, title: "T-Shirt Order #1001", status: "Cutting", assignedTo: "worker@tex.com" },
  { id: 2, title: "Dress Order #1002", status: "To Do", assignedTo: null },
  { id: 3, title: "Hoodie Order #1003", status: "Done", assignedTo: "manager@tex.com" },
  { id: 4, title: "Jeans Order #1001", status: "Sewing", assignedTo: "worker@tex.com" },
  { id: 5, title: "Jacket Order #1004", status: "Quality Check", assignedTo: "manager@tex.com" },
]

// Sample users data
const SAMPLE_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@tex.com",
    role: "admin",
    department: "Management",
    salary: 75000,
    joinDate: "2023-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Production Manager",
    email: "manager@tex.com",
    role: "manager",
    department: "Production",
    salary: 55000,
    joinDate: "2023-03-20",
    status: "Active",
  },
  {
    id: 3,
    name: "Factory Worker",
    email: "worker@tex.com",
    role: "worker",
    department: "Production",
    salary: 35000,
    joinDate: "2023-06-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Quality Inspector",
    email: "inspector@tex.com",
    role: "worker",
    department: "Quality",
    salary: 40000,
    joinDate: "2023-08-05",
    status: "Active",
  },
  {
    id: 5,
    name: "HR Manager",
    email: "hr@tex.com",
    role: "manager",
    department: "Human Resources",
    salary: 60000,
    joinDate: "2023-02-12",
    status: "Active",
  },
]

// Sample payroll data
const SAMPLE_PAYROLL = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Admin User",
    month: "January 2024",
    basicSalary: 75000,
    overtime: 5000,
    deductions: 8000,
    netSalary: 72000,
    status: "Paid",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Production Manager",
    month: "January 2024",
    basicSalary: 55000,
    overtime: 3000,
    deductions: 6000,
    netSalary: 52000,
    status: "Paid",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Factory Worker",
    month: "January 2024",
    basicSalary: 35000,
    overtime: 2000,
    deductions: 3500,
    netSalary: 33500,
    status: "Pending",
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: "Quality Inspector",
    month: "January 2024",
    basicSalary: 40000,
    overtime: 1500,
    deductions: 4000,
    netSalary: 37500,
    status: "Pending",
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: "HR Manager",
    month: "January 2024",
    basicSalary: 60000,
    overtime: 2500,
    deductions: 6500,
    netSalary: 56000,
    status: "Paid",
  },
]

export function DataProvider({ children }) {
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY)
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [production, setProduction] = useState(SAMPLE_PRODUCTION)
  const [users, setUsers] = useState(SAMPLE_USERS)
  const [payroll, setPayroll] = useState(SAMPLE_PAYROLL)

  // Inventory functions
  const addInventoryItem = (item) => {
    const newItem = { ...item, id: Date.now() }
    setInventory([...inventory, newItem])
  }

  const updateInventoryItem = (id, updatedItem) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
  }

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  // Order functions
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      orderDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    }
    setOrders([...orders, newOrder])
  }

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  // Production functions
  const updateProductionStatus = (id, status) => {
    setProduction(production.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const assignWorker = (id, workerEmail) => {
    setProduction(production.map((item) => (item.id === id ? { ...item, assignedTo: workerEmail } : item)))
  }

  // User management functions
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now(), status: "Active" }
    setUsers([...users, newUser])
  }

  const updateUser = (id, updatedUser) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)))
  }

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Payroll functions
  const addPayrollRecord = (record) => {
    const newRecord = { ...record, id: Date.now() }
    setPayroll([...payroll, newRecord])
  }

  const updatePayrollRecord = (id, updatedRecord) => {
    setPayroll(payroll.map((record) => (record.id === id ? { ...record, ...updatedRecord } : record)))
  }

  const deletePayrollRecord = (id) => {
    setPayroll(payroll.filter((record) => record.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        orders,
        addOrder,
        updateOrderStatus,
        production,
        updateProductionStatus,
        assignWorker,
        users,
        addUser,
        updateUser,
        deleteUser,
        payroll,
        addPayrollRecord,
        updatePayrollRecord,
        deletePayrollRecord,
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
