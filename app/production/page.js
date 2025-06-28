"use client"

import { useState } from "react"
import Layout from "../../components/Layout"
import { useData } from "../../contexts/DataContext"
import { useAuth } from "../../contexts/AuthContext"

const PRODUCTION_STAGES = ["To Do", "Cutting", "Sewing", "Quality Check", "Done"]

export default function Production() {
  const { production, updateProductionStatus, assignWorker } = useData()
  const { user } = useAuth()
  const [draggedItem, setDraggedItem] = useState(null)

  const handleDragStart = (e, item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggedItem) {
      updateProductionStatus(draggedItem.id, newStatus)
      setDraggedItem(null)
    }
  }

  const handleWorkerAssignment = (itemId, workerEmail) => {
    assignWorker(itemId, workerEmail)
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case "To Do":
        return "bg-gray-100 border-gray-300"
      case "Cutting":
        return "bg-blue-100 border-blue-300"
      case "Sewing":
        return "bg-yellow-100 border-yellow-300"
      case "Quality Check":
        return "bg-orange-100 border-orange-300"
      case "Done":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getItemsByStatus = (status) => {
    return production.filter((item) => item.status === status)
  }

  const workers = ["worker@tex.com", "manager@tex.com"]

  return (
    <Layout currentPage="/production">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Tracking</h1>
          <p className="text-gray-600">Track production progress with drag-and-drop board</p>
        </div>

        {/* Production board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {PRODUCTION_STAGES.map((stage) => {
            const items = getItemsByStatus(stage)
            return (
              <div
                key={stage}
                className={`rounded-lg border-2 border-dashed p-4 min-h-96 ${getStageColor(stage)}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{stage}</h3>
                  <span className="bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-600">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="bg-white rounded-lg p-3 shadow-sm border cursor-move hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-2">{item.title}</h4>

                      {(user?.role === "admin" || user?.role === "manager") && (
                        <div className="mt-2">
                          <label className="block text-xs text-gray-500 mb-1">Assigned to:</label>
                          <select
                            value={item.assignedTo || ""}
                            onChange={(e) => handleWorkerAssignment(item.id, e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Unassigned</option>
                            {workers.map((worker) => (
                              <option key={worker} value={worker}>
                                {worker.split("@")[0]}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {item.assignedTo && (
                        <div className="mt-2 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-600">{item.assignedTo.split("@")[0]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Production statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Production Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PRODUCTION_STAGES.map((stage) => {
              const count = getItemsByStatus(stage).length
              const percentage = production.length > 0 ? Math.round((count / production.length) * 100) : 0
              return (
                <div key={stage} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-500">{stage}</div>
                  <div className="text-xs text-gray-400">{percentage}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag and drop production items between stages</li>
            <li>• Assign workers to production items (Admin/Manager only)</li>
            <li>• Track progress from "To Do" to "Done"</li>
            <li>• View production statistics at the bottom</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
