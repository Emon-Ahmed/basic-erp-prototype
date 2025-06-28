"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ERP Prototype...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ERP Prototype</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern ERP Solution
            <span className="block text-blue-600">for Your Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your garment production with our comprehensive ERP system. Manage inventory, orders, production,
            HR, and payroll all in one place.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium"
            >
              Get Started
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-md text-lg font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Comprehensive tools for modern business management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Inventory Management",
              description: "Track materials, supplies, and stock levels with automated alerts",
              icon: "📦",
            },
            {
              title: "Order Processing",
              description: "Manage customer orders from creation to completion",
              icon: "📋",
            },
            {
              title: "Production Tracking",
              description: "Visual kanban board for production workflow management",
              icon: "🏭",
            },
            {
              title: "HR Management",
              description: "Employee management with role-based access control",
              icon: "👥",
            },
            {
              title: "Payroll System",
              description: "Automated payroll processing and salary management",
              icon: "💰",
            },
            {
              title: "User Profiles",
              description: "Customizable user profiles and settings management",
              icon: "⚙️",
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of businesses using our ERP solution</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md text-lg font-medium"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ERP Prototype</h3>
              <p className="text-gray-400">Modern business management solution for the digital age.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ERP Prototype. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
