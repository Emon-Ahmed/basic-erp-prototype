"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Factory, User, Clock } from "lucide-react"

const statusColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-100" },
  { id: "cutting", title: "Cutting", color: "bg-blue-100" },
  { id: "sewing", title: "Sewing", color: "bg-yellow-100" },
  { id: "quality", title: "Quality Check", color: "bg-purple-100" },
  { id: "done", title: "Done", color: "bg-green-100" },
]

const sampleWorkers = [
  { id: "1", name: "Admin User" },
  { id: "2", name: "Manager User" },
  { id: "3", name: "Worker User" },
]

export default function ProductionPage() {
  const { productionTasks, updateTaskStatus, assignWorker, orders } = useData()
  const { user } = useAuth()
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask) {
      updateTaskStatus(draggedTask, newStatus as any)
      setDraggedTask(null)
    }
  }

  const handleWorkerAssign = (taskId: string, workerId: string) => {
    assignWorker(taskId, workerId)
  }

  const getTasksByStatus = (status: string) => {
    return productionTasks.filter((task) => task.status === status)
  }

  const getOrderDetails = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  const getWorkerName = (workerId?: string) => {
    const worker = sampleWorkers.find((w) => w.id === workerId)
    return worker?.name || "Unassigned"
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Production Tracking</h1>
            <p className="text-gray-600">Manage production workflow and assignments</p>
          </div>

          {/* Production Board */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {statusColumns.map((column) => (
              <Card
                key={column.id}
                className={`${column.color} min-h-96`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{column.title}</span>
                    <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getTasksByStatus(column.id).map((task) => {
                    const orderDetails = getOrderDetails(task.orderId)
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-white p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                        {orderDetails && (
                          <div className="text-xs text-gray-600 mb-2">Customer: {orderDetails.customer}</div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="mr-1 h-3 w-3" />
                            {getWorkerName(task.assignedWorker)}
                          </div>
                          {(user?.role === "admin" || user?.role === "manager") && (
                            <select
                              value={task.assignedWorker || ""}
                              onChange={(e) => handleWorkerAssign(task.id, e.target.value)}
                              className="text-xs border rounded px-1 py-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="">Unassigned</option>
                              {sampleWorkers.map((worker) => (
                                <option key={worker.id} value={worker.id}>
                                  {worker.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Production Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Factory className="mr-2 h-5 w-5" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {productionTasks.filter((task) => task.status !== "done").length}
                </div>
                <p className="text-sm text-gray-600">Tasks in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Completed Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {productionTasks.filter((task) => task.status === "done").length}
                </div>
                <p className="text-sm text-gray-600">Tasks completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Worker Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleWorkers.map((worker) => {
                    const assignedTasks = productionTasks.filter(
                      (task) => task.assignedWorker === worker.id && task.status !== "done",
                    ).length
                    return (
                      <div key={worker.id} className="flex justify-between text-sm">
                        <span>{worker.name}</span>
                        <Badge variant="outline">{assignedTasks} tasks</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
