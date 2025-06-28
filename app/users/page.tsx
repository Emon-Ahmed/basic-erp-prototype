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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, Users, UserCheck, UserX, Building } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "worker" as "admin" | "manager" | "worker",
    department: "",
    salary: "",
  })

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.salary) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const employee = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      salary: Number.parseFloat(newUser.salary),
      joinDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
    }

    addEmployee(employee)
    setNewUser({ name: "", email: "", role: "worker", department: "", salary: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "User added successfully",
    })
  }

  const handleEditUser = (employee: any) => {
    setEditingUser(employee)
    setNewUser({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      salary: employee.salary.toString(),
    })
  }

  const handleUpdateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department || !newUser.salary) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const updatedEmployee = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      salary: Number.parseFloat(newUser.salary),
    }

    updateEmployee(editingUser.id, updatedEmployee)
    setEditingUser(null)
    setNewUser({ name: "", email: "", role: "worker", department: "", salary: "" })
    toast({
      title: "Success",
      description: "User updated successfully",
    })
  }

  const handleDeleteUser = (employeeId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteEmployee(employeeId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
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

  const getAvailableRoles = () => {
    if (user?.role === "admin") {
      return ["worker", "manager", "admin"]
    }
    return ["worker"]
  }

  const totalUsers = employees.length
  const activeUsers = employees.filter((emp) => emp.status === "active").length
  const adminUsers = employees.filter((emp) => emp.role === "admin").length
  const managerUsers = employees.filter((emp) => emp.role === "manager").length

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">Manage system users and their permissions</p>
            </div>
            <Dialog
              open={isAddDialogOpen || !!editingUser}
              onOpenChange={(open) => {
                if (!open) {
                  setIsAddDialogOpen(false)
                  setEditingUser(null)
                  setNewUser({ name: "", email: "", role: "worker", department: "", salary: "" })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "Update user information and permissions."
                      : "Create a new user account with appropriate permissions."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "admin" | "manager" | "worker") => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">
                      Salary
                    </Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newUser.salary}
                      onChange={(e) => setNewUser({ ...newUser, salary: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={editingUser ? handleUpdateUser : handleAddUser}>
                    {editingUser ? "Update User" : "Add User"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">All system users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminUsers}</div>
                <p className="text-xs text-muted-foreground">System administrators</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Managers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{managerUsers}</div>
                <p className="text-xs text-muted-foreground">Department managers</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Join Date</TableHead>
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
                        <TableCell>{employee.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(employee)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(employee.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
