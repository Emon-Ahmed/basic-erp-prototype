"use client"

import { useAuth } from "@/contexts/auth-context"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap, Shield, Users, BarChart3, Headphones } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small businesses getting started",
    features: ["Up to 5 users", "Basic inventory management", "Order tracking", "Production board", "Email support"],
    current: true,
    icon: Star,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "Advanced features for growing businesses",
    features: [
      "Up to 25 users",
      "Advanced inventory analytics",
      "Custom reports",
      "API access",
      "Priority support",
      "Multi-location support",
      "Advanced production planning",
    ],
    popular: true,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "Complete solution for large organizations",
    features: [
      "Unlimited users",
      "Custom integrations",
      "Advanced security",
      "Dedicated account manager",
      "24/7 phone support",
      "Custom training",
      "SLA guarantee",
      "White-label options",
    ],
    icon: Shield,
  },
]

const benefits = [
  {
    icon: Users,
    title: "Scale Your Team",
    description: "Add unlimited users and manage complex organizational structures",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights with custom reports and real-time dashboards",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Advanced security features including SSO and audit logs",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get help when you need it with priority support and dedicated account management",
  },
]

export default function UpgradePage() {
  const { user } = useAuth()

  const handleUpgrade = (planName: string) => {
    // Mock upgrade function
    alert(`Upgrading to ${planName} plan... (This is a demo)`)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock powerful features to scale your garment production business
            </p>
          </div>

          {/* Current Plan Status */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Current Plan: Starter</h3>
                  <p className="text-blue-700">You're currently on our free plan</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Free Plan
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular
                      ? "border-blue-500 shadow-lg scale-105"
                      : plan.current
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white px-3 py-1">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      {plan.period && <span className="text-lg font-normal text-gray-600">{plan.period}</span>}
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      {plan.current ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant={plan.popular ? "default" : "outline"}
                          onClick={() => handleUpgrade(plan.name)}
                        >
                          Upgrade to {plan.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Why Upgrade Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Why Upgrade?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom Solution */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Need a Custom Solution?</CardTitle>
              <CardDescription>We can create a tailored plan that fits your specific business needs</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>

          {/* FAQ or Additional Info */}
          <div className="text-center text-sm text-gray-500">
            <p>All plans include a 30-day money-back guarantee</p>
            <p className="mt-2">Questions? Contact our support team at support@textrack.com</p>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
