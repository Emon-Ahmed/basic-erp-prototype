"use client"

import Layout from "../../components/Layout"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export default function Upgrade() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses",
      features: ["Up to 10 users", "Basic inventory management", "Order processing", "Email support", "5GB storage"],
      limitations: ["No advanced analytics", "No API access", "No custom integrations"],
      current: true,
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Up to 50 users",
        "Advanced inventory management",
        "Production tracking",
        "HR & Payroll",
        "Priority support",
        "50GB storage",
        "Advanced analytics",
        "API access",
      ],
      limitations: ["No white-label options", "Limited custom integrations"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Unlimited users",
        "Full ERP suite",
        "Custom integrations",
        "White-label options",
        "24/7 phone support",
        "Unlimited storage",
        "Advanced security",
        "Custom training",
        "Dedicated account manager",
      ],
      limitations: [],
      enterprise: true,
    },
  ]

  const addOns = [
    {
      name: "Advanced Analytics",
      price: "$19/month",
      description: "Detailed reports and business intelligence",
    },
    {
      name: "Mobile App",
      price: "$15/month",
      description: "iOS and Android apps for on-the-go management",
    },
    {
      name: "Custom Integrations",
      price: "$49/month",
      description: "Connect with your existing tools and systems",
    },
    {
      name: "Priority Support",
      price: "$29/month",
      description: "24/7 priority customer support",
    },
  ]

  return (
    <Layout currentPage="/upgrade">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>
          <p className="mt-4 text-lg text-gray-600">Choose the perfect plan for your business needs</p>
        </div>

        {/* Current Plan Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">Current Plan: Basic</h3>
              <p className="text-blue-700">You're currently on the Basic plan with 3/10 users</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">$29/month</p>
              <p className="text-sm text-blue-700">Next billing: March 15, 2024</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border-2 p-6 ${
                plan.popular
                  ? "border-blue-500 bg-blue-50"
                  : plan.current
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="text-center">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="text-center">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Features included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Not included:</h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center">
                        <XMarkIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <button
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    plan.current
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addon) => (
              <div key={addon.name} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{addon.name}</h3>
                    <p className="text-gray-600 mt-1">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{addon.price}</p>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Can I change my plan anytime?</h3>
              <p className="text-gray-600 mt-1">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">What happens to my data if I downgrade?</h3>
              <p className="text-gray-600 mt-1">
                Your data is always safe. If you exceed limits after downgrading, you'll be notified to upgrade again.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-600 mt-1">
                Yes, we offer custom solutions for large enterprises. Contact our sales team for more information.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-blue-100 mb-6">Our team is here to help you find the perfect plan for your business</p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </Layout>
  )
}
