"use client"

import { useState } from "react"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import Layout from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Clock, TrendingUp, Search, Printer, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function HRPage() {
  const { employees, payrollRecords, generatePayroll, updatePayrollStatus } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [payrollSearchTerm, setPayrollSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPayrollRecords = payrollRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(payrollSearchTerm.toLowerCase()) ||
      record.payPeriod.toLowerCase().includes(payrollSearchTerm.toLowerCase()),
  )

  const handleGeneratePayroll = (employeeId: string) => {
    generatePayroll(employeeId)
    toast({
      title: "Success",
      description: "Payroll generated successfully",
    })
  }

  const handleMarkAsPaid = (recordId: string) => {
    updatePayrollStatus(recordId, "paid")
    toast({
      title: "Success",
      description: "Payment marked as paid",
    })
  }

  const handlePrintPayslip = (record: any) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payslip - ${record.employeeName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .details { margin-bottom: 20px; }
              .table { width: 100%; border-collapse: collapse; }
              .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .table th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ERP Prototype</h1>
              <h2>Payslip</h2>
            </div>
            <div class="details">
              <p><strong>Employee:</strong> ${record.employeeName}</p>
              <p><strong>Pay Period:</strong> ${record.payPeriod}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <table class="table">
              <tr><th>Description</th><th>Amount</th></tr>
              <tr><td>Base Salary</td><td>$${record.baseSalary.toFixed(2)}</td></tr>
              <tr><td>Overtime</td><td>$${record.overtime.toFixed(2)}</td></tr>
              <tr><td>Deductions</td><td>-$${record.deductions.toFixed(2)}</td></tr>
              <tr><th>Net Pay</th><th>$${record.netPay.toFixed(2)}</th></tr>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "worker":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalEmployees = employees.length
  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netPay, 0)
  const pendingPayments = payrollRecords.filter((record) => record.status === "pending").length
  const averageSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length

  // Department summary
  const departmentSummary = employees.reduce(
    (acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { count: 0, totalSalary: 0 }
      }
      acc[emp.department].count++
      acc[emp.department].totalSalary += emp.salary
      return acc
    },
    {} as Record<string, { count: number; totalSalary: number }>,
  )

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <Layout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR & Payroll</h1>
            <p className="text-muted-foreground">Manage employees and payroll operations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">Active employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPayroll.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Monthly payroll</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPayments}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageSalary.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Per employee</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="employees" className="space-y-4">
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Management</CardTitle>
                  <CardDescription>View and manage employee information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Salary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(employee.role)}>{employee.role}</Badge>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>${employee.salary.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleGeneratePayroll(employee.id)}>
                                Generate Payroll
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payroll" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Records</CardTitle>
                  <CardDescription>Manage employee payroll and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search payroll records..."
                        value={payrollSearchTerm}
                        onChange={(e) => setPayrollSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Pay Period</TableHead>
                          <TableHead>Base Salary</TableHead>
                          <TableHead>Overtime</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Net Pay</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayrollRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.employeeName}</TableCell>
                            <TableCell>{record.payPeriod}</TableCell>
                            <TableCell>${record.baseSalary.toFixed(2)}</TableCell>
                            <TableCell>${record.overtime.toFixed(2)}</TableCell>
                            <TableCell>${record.deductions.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">${record.netPay.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === "paid" ? "default" : "secondary"}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handlePrintPayslip(record)}>
                                  <Printer className="h-4 w-4" />
                                </Button>
                                {record.status === "pending" && (
                                  <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(record.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Summary</CardTitle>
                    <CardDescription>Employee count and salary by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(departmentSummary).map(([dept, data]) => (
                        <div key={dept} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{dept}</p>
                            <p className="text-sm text-muted-foreground">{data.count} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${data.totalSalary.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              Avg: ${(data.totalSalary / data.count).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Current payroll statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Records:</span>
                        <span className="font-medium">{payrollRecords.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Records:</span>
                        <span className="font-medium">{payrollRecords.filter((r) => r.status === "paid").length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Records:</span>
                        <span className="font-medium">{pendingPayments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Paid:</span>
                        <span className="font-medium">
                          $
                          {payrollRecords
                            .filter((r) => r.status === "paid")
                            .reduce((sum, r) => sum + r.netPay, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Pending:</span>
                        <span className="font-medium">
                          $
                          {payrollRecords
                            .filter((r) => r.status === "pending")
                            .reduce((sum, r) => sum + r.netPay, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
