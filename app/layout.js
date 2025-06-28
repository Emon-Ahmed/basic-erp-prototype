import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "../contexts/AuthContext"
import { DataProvider } from "../contexts/DataContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ERP Prototype - Business Management System",
  description: "A comprehensive ERP system for modern business management",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
