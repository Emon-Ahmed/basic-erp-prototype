"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  threshold: number
}

interface OrderItem {
  name: string
  quantity: number
}

interface Order {
  id: string
  customer: string
  items: OrderItem[]
  status: "pending" | "production" | "completed"
  createdAt: string
}

interface ProductionTask {
  id: string
  title: string
  orderId: string
  status: "todo" | "cutting" | "sewing" | "quality" | "done"
  assignedWorker?: string
}

interface Employee {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "worker"
  department: string
  salary: number
  joinDate: string
}

interface DataContextType {
  inventory: InventoryItem[]
  orders: Order[]
  productionTasks: ProductionTask[]
  employees: Employee[]
  updateOrderStatus: (orderId: string, status: "pending" | "production" | "completed") => void
  updateTaskStatus: (taskId: string, status: "todo" | "cutting" | "sewing" | "quality" | "done") => void
  assignWorker: (taskId: string, workerId: string) => void
  addEmployee: (employee: Employee) => void
  updateEmployee: (employee: Employee) => void
  deleteEmployee: (employeeId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Sample data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Cotton Fabric",
    category: "fabric",
    quantity: 45,
    unit: "yards",
    threshold: 50,
  },
  {
    id: "2",
    name: "Thread",
    category: "supplies",
    quantity: 15,
    unit: "spools",
    threshold: 20,
  },
  {
    id: "3",
    name: "Buttons",
    category: "accessories",
    quantity: 8,
    unit: "packs",
    threshold: 10,
  },
  {
    id: "4",
    name: "Zippers",
    category: "accessories",
    quantity: 25,
    unit: "pieces",
    threshold: 15,
  },
]

const sampleOrders: Order[] = [
  {
    id: "ORD001",
    customer: "Fashion Retail Co.",
    items: [
      { name: "T-Shirts", quantity: 100 },
      { name: "Jeans", quantity: 50 },
    ],
    status: "production",
    createdAt: "2024-01-15",
  },
  {
    id: "ORD002",
    customer: "Urban Clothing",
    items: [{ name: "Hoodies", quantity: 75 }],
    status: "pending",
    createdAt: "2024-01-16",
  },
  {
    id: "ORD003",
    customer: "Style Boutique",
    items: [
      { name: "Dresses", quantity: 30 },
      { name: "Skirts", quantity: 20 },
    ],
    status: "completed",
    createdAt: "2024-01-14",
  },
]

const sampleProductionTasks: ProductionTask[] = [
  {
    id: "TASK001",
    title: "Cut fabric for T-Shirts",
    orderId: "ORD001",
    status: "cutting",
    assignedWorker: "3",
  },
  {
    id: "TASK002",
    title: "Sew sleeves for Hoodies",
    orderId: "ORD002",
    status: "sewing",
    assignedWorker: "2",
  },
  {
    id: "TASK003",
    title: "Quality check for Dresses",
    orderId: "ORD003",
    status: "quality",
    assignedWorker: "1",
  },
  {
    id: "TASK004",
    title: "Package completed items",
    orderId: "ORD003",
    status: "done",
  },
  {
    id: "TASK005",
    title: "Prepare materials for Jeans",
    orderId: "ORD001",
    status: "todo",
  },
]

const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@erp.com",
    role: "admin",
    department: "Management",
    salary: 75000,
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@erp.com",
    role: "manager",
    department: "Production",
    salary: 55000,
    joinDate: "2023-03-20",
  },
  {
    id: "3",
    name: "Worker User",
    email: "worker@erp.com",
    role: "worker",
    department: "Production",
    salary: 35000,
    joinDate: "2023-06-10",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [inventory] = useState<InventoryItem[]>(sampleInventory)
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [productionTasks, setProductionTasks] = useState<ProductionTask[]>(sampleProductionTasks)
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)

  const updateOrderStatus = (orderId: string, status: "pending" | "production" | "completed") => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const updateTaskStatus = (taskId: string, status: "todo" | "cutting" | "sewing" | "quality" | "done") => {
    setProductionTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const assignWorker = (taskId: string, workerId: string) => {
    setProductionTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, assignedWorker: workerId } : task)),
    )
  }

  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee])
  }

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
  }

  const deleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
  }

  const value: DataContextType = {
    inventory,
    orders,
    productionTasks,
    employees,
    updateOrderStatus,
    updateTaskStatus,
    assignWorker,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
