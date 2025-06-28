"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, roles: ["admin", "manager", "worker"] },
  { name: "Inventory", href: "/inventory", icon: CubeIcon, roles: ["admin", "manager"] },
  { name: "Orders", href: "/orders", icon: ClipboardDocumentListIcon, roles: ["admin", "manager"] },
  { name: "Production", href: "/production", icon: CogIcon, roles: ["admin", "manager", "worker"] },
  { name: "HR & Payroll", href: "/hr", icon: CurrencyDollarIcon, roles: ["admin", "manager"] },
  { name: "User Management", href: "/users", icon: UsersIcon, roles: ["admin"] },
  { name: "Profile Settings", href: "/profile", icon: UserCircleIcon, roles: ["admin", "manager", "worker"] },
  { name: "Upgrade", href: "/upgrade", icon: ArrowUpIcon, roles: ["admin"] },
]

export default function Layout({ children, currentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">ERP Prototype</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === item.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">ERP Prototype</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === item.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-3 flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {currentPage?.replace("/", "") || "Dashboard"}
              </h2>
            </div>
          </div>
        </div>
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
