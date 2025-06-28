"use client"

import { useState } from "react"
import Layout from "../../components/Layout"
import { useAuth } from "../../contexts/AuthContext"
import { UserIcon, KeyIcon, BellIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    department: "Production",
    bio: "Experienced production manager with 5+ years in garment manufacturing.",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    inventoryAlerts: true,
    productionUpdates: false,
  })

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "security", name: "Security", icon: KeyIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "privacy", name: "Privacy", icon: ShieldCheckIcon },
  ]

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // Mock save functionality
    alert("Profile updated successfully!")
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    // Mock password change
    alert("Password changed successfully!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  return (
    <Layout currentPage="/profile">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === "profile" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="Production">Production</option>
                          <option value="Quality">Quality</option>
                          <option value="Management">Management</option>
                          <option value="Human Resources">Human Resources</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Change Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Receive notifications for {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">Data Collection</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        We collect data to improve your experience and provide better services.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">Data Sharing</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Your data is never shared with third parties without your consent.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">Account Deletion</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        You can request account deletion at any time. Contact support for assistance.
                      </p>
                      <button className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
