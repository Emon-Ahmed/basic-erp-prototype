"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Factory, Users, User, DollarSign, LogOut, Crown } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "worker"],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    roles: ["admin", "manager"],
  },
  {
    name: "Production",
    href: "/production",
    icon: Factory,
    roles: ["admin", "manager", "worker"],
  },
  {
    name: "HR & Payroll",
    href: "/hr",
    icon: DollarSign,
    roles: ["admin", "manager"],
  },
  {
    name: "User Management",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Profile Settings",
    href: "/profile",
    icon: User,
    roles: ["admin", "manager", "worker"],
  },
  {
    name: "Upgrade",
    href: "/upgrade",
    icon: Crown,
    roles: ["admin"],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredNavigation = navigationItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">ERP Prototype</h2>
        <p className="text-sm text-gray-600">{user?.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

// Also export as default for backward compatibility
export default Sidebar
