"use client"

import { useState } from "react"
import Layout from "../../components/Layout"
import { useData } from "../../contexts/DataContext"
import { PlusIcon, PencilIcon, TrashIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline"

export default function HRPayroll() {
  const { payroll, addPayrollRecord, updatePayrollRecord, deletePayrollRecord, users } = useData()
  const [activeTab, setActiveTab] = useState("payroll")
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    month: "",
    basicSalary: "",
    overtime: "",
    deductions: "",
    status: "Pending",
  })

  const tabs = [
    { id: "payroll", name: "Payroll Management" },
    { id: "reports", name: "HR Reports" },
    { id: "attendance", name: "Attendance" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const recordData = {
      ...formData,
      basicSalary: Number.parseFloat(formData.basicSalary),
      overtime: Number.parseFloat(formData.overtime),
      deductions: Number.parseFloat(formData.deductions),
      netSalary:
        Number.parseFloat(formData.basicSalary) +
        Number.parseFloat(formData.overtime) -
        Number.parseFloat(formData.deductions),
    }

    if (editingRecord) {
      updatePayrollRecord(editingRecord.id, recordData)
      setEditingRecord(null)
    } else {
      addPayrollRecord(recordData)
    }

    setFormData({
      employeeId: "",
      employeeName: "",
      month: "",
      basicSalary: "",
      overtime: "",
      deductions: "",
      status: "Pending",
    })
    setShowForm(false)
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      employeeId: record.employeeId.toString(),
      employeeName: record.employeeName,
      month: record.month,
      basicSalary: record.basicSalary.toString(),
      overtime: record.overtime.toString(),
      deductions: record.deductions.toString(),
      status: record.status,
    })
    setShowForm(true)
  }

  const exportPayslip = (record) => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${record.employeeName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ERP Prototype</h1>
            <h2>Payslip</h2>
          </div>
          <div class="details">
            <p><strong>Employee:</strong> ${record.employeeName}</p>
            <p><strong>Employee ID:</strong> ${record.employeeId}</p>
            <p><strong>Month:</strong> ${record.month}</p>
            <p><strong>Status:</strong> ${record.status}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Salary</td>
                <td>$${record.basicSalary}</td>
              </tr>
              <tr>
                <td>Overtime</td>
                <td>$${record.overtime}</td>
              </tr>
              <tr>
                <td>Deductions</td>
                <td>-$${record.deductions}</td>
              </tr>
              <tr class="total">
                <td>Net Salary</td>
                <td>$${record.netSalary}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status) => {
    return status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  return (
    <Layout currentPage="/hr">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR & Payroll</h1>
            <p className="text-gray-600">Manage employee payroll and HR operations</p>
          </div>
          {activeTab === "payroll" && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Payroll Record
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === "payroll" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payroll.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.basicSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.overtime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.deductions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${record.netSalary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => exportPayslip(record)} className="text-green-600 hover:text-green-900">
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePayrollRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Payroll</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${payroll.reduce((sum, record) => sum + record.netSalary, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Paid Records</h3>
              <p className="text-3xl font-bold text-green-600">
                {payroll.filter((record) => record.status === "Paid").length}
              </p>
              <p className="text-sm text-gray-500">Out of {payroll.length} total</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Records</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {payroll.filter((record) => record.status === "Pending").length}
              </p>
              <p className="text-sm text-gray-500">Awaiting processing</p>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Overview</h3>
            <p className="text-gray-600">Attendance tracking feature coming soon...</p>
          </div>
        )}

        {/* Add/Edit form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRecord ? "Edit Payroll Record" : "Add Payroll Record"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => {
                      const selectedUser = users.find((u) => u.id.toString() === e.target.value)
                      setFormData({
                        ...formData,
                        employeeId: e.target.value,
                        employeeName: selectedUser ? selectedUser.name : "",
                      })
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Employee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Month</label>
                  <input
                    type="text"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., January 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                  <input
                    type="number"
                    required
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overtime</label>
                  <input
                    type="number"
                    required
                    value={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deductions</label>
                  <input
                    type="number"
                    required
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingRecord(null)
                      setFormData({
                        employeeId: "",
                        employeeName: "",
                        month: "",
                        basicSalary: "",
                        overtime: "",
                        deductions: "",
                        status: "Pending",
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
                    {editingRecord ? "Update" : "Add"} Record
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
