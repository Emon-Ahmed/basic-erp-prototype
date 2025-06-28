"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  minStock: number
  unitPrice: number
  supplier: string
  lastUpdated: string
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  items: string[]
  status: "pending" | "production" | "completed" | "cancelled"
  total: number
  createdAt: string
}

interface ProductionTask {
  id: string
  title: string
  customer: string
  status: "todo" | "cutting" | "sewing" | "quality" | "done"
  assignedWorker?: string
  dueDate: string
}

interface Employee {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "worker"
  department: string
  salary: number
  joinDate: string
  status: "active" | "inactive"
}

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  baseSalary: number
  overtime: number
  deductions: number
  netPay: number
  payPeriod: string
  status: "pending" | "paid"
}

interface DataContextType {
  inventory: InventoryItem[]
  orders: Order[]
  productionTasks: ProductionTask[]
  employees: Employee[]
  payrollRecords: PayrollRecord[]
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  addOrder: (order: Omit<Order, "id">) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void
  deleteOrder: (id: string) => void
  updateTaskStatus: (id: string, status: ProductionTask["status"]) => void
  assignWorker: (taskId: string, workerId: string) => void
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  generatePayroll: (employeeId: string) => void
  updatePayrollStatus: (id: string, status: PayrollRecord["status"]) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Sample data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Cotton Fabric",
    category: "Fabric",
    quantity: 150,
    minStock: 200,
    unitPrice: 12.5,
    supplier: "Textile Co.",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Polyester Thread",
    category: "Thread",
    quantity: 50,
    minStock: 100,
    unitPrice: 3.25,
    supplier: "Thread Supply Inc.",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Buttons",
    category: "Accessories",
    quantity: 500,
    minStock: 1000,
    unitPrice: 0.15,
    supplier: "Button World",
    lastUpdated: "2024-01-13",
  },
]

const sampleOrders: Order[] = [
  {
    id: "1",
    customer: "Fashion Retail Co.",
    items: ["T-Shirts", "Jeans"],
    status: "production",
    total: 3750,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    customer: "Urban Clothing",
    items: ["Hoodies", "Sweatpants"],
    status: "pending",
    total: 4500,
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    customer: "Casual Wear Ltd.",
    items: ["Polo Shirts"],
    status: "completed",
    total: 4000,
    createdAt: "2024-01-08",
  },
]

const sampleProductionTasks: ProductionTask[] = [
  {
    id: "1",
    title: "Cut fabric for T-shirts",
    customer: "Fashion Retail Co.",
    status: "cutting",
    assignedWorker: "Mike Worker",
    dueDate: "2024-01-20",
  },
  {
    id: "2",
    title: "Sew Hoodies",
    customer: "Urban Clothing",
    status: "todo",
    dueDate: "2024-01-25",
  },
]

const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@erp.com",
    role: "admin",
    department: "Management",
    salary: 85000,
    joinDate: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@erp.com",
    role: "manager",
    department: "Production",
    salary: 65000,
    joinDate: "2023-03-20",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Worker",
    email: "worker@erp.com",
    role: "worker",
    department: "Production",
    salary: 45000,
    joinDate: "2023-06-10",
    status: "active",
  },
]

const samplePayrollRecords: PayrollRecord[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Admin",
    baseSalary: 7083.33,
    overtime: 0,
    deductions: 850,
    netPay: 6233.33,
    payPeriod: "January 2024",
    status: "paid",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory)
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [productionTasks, setProductionTasks] = useState<ProductionTask[]>(sampleProductionTasks)
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(samplePayrollRecords)

  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = { ...item, id: Date.now().toString() }
    setInventory((prev) => [...prev, newItem])
  }

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id))
  }

  const addOrder = (order: Omit<Order, "id">) => {
    const newOrder = { ...order, id: Date.now().toString() }
    setOrders((prev) => [...prev, newOrder])
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const updateTaskStatus = (id: string, status: ProductionTask["status"]) => {
    setProductionTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  const assignWorker = (taskId: string, workerId: string) => {
    const worker = employees.find((emp) => emp.id === workerId)
    setProductionTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, assignedWorker: worker?.name } : task)),
    )
  }

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = { ...employee, id: Date.now().toString() }
    setEmployees((prev) => [...prev, newEmployee])
  }

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  const generatePayroll = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee) {
      const baseSalary = employee.salary / 12
      const overtime = Math.random() * 300
      const deductions = baseSalary * 0.12
      const netPay = baseSalary + overtime - deductions

      const newPayroll: PayrollRecord = {
        id: Date.now().toString(),
        employeeId: employee.id,
        employeeName: employee.name,
        baseSalary,
        overtime,
        deductions,
        netPay,
        payPeriod: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        status: "pending",
      }

      setPayrollRecords((prev) => [...prev, newPayroll])
    }
  }

  const updatePayrollStatus = (id: string, status: PayrollRecord["status"]) => {
    setPayrollRecords((prev) => prev.map((record) => (record.id === id ? { ...record, status } : record)))
  }

  const value: DataContextType = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    orders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    productionTasks,
    updateTaskStatus,
    assignWorker,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    payrollRecords,
    generatePayroll,
    updatePayrollStatus,
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
