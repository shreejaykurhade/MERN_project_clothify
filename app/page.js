"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Store, Shield, Eye, Package, Truck } from "lucide-react"

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Browse products, manage cart, place orders",
    icon: ShoppingCart,
    color: "bg-blue-500",
    features: ["Product Catalog", "Shopping Cart", "Order History", "Reviews"],
  },
  {
    id: "vendor",
    title: "Vendor",
    description: "Manage your store, products, and orders",
    icon: Store,
    color: "bg-green-500",
    features: ["Product Management", "Order Processing", "Store Dashboard", "Stock Control"],
  },
  {
    id: "admin",
    title: "Admin",
    description: "Platform administration and user management",
    icon: Shield,
    color: "bg-red-500",
    features: ["User Management", "Vendor Approvals", "Platform Reports", "System Settings"],
  },
  {
    id: "moderator",
    title: "Moderator",
    description: "Content moderation and review management",
    icon: Eye,
    color: "bg-purple-500",
    features: ["Review Moderation", "Content Approval", "Flag Management", "Quality Control"],
  },
  {
    id: "inventory",
    title: "Inventory Manager",
    description: "Stock management and inventory control",
    icon: Package,
    color: "bg-orange-500",
    features: ["Stock Levels", "Low Stock Alerts", "Product Tagging", "Inventory Reports"],
  },
  {
    id: "delivery",
    title: "Delivery Agent",
    description: "Order delivery and logistics management",
    icon: Truck,
    color: "bg-teal-500",
    features: ["Delivery Queue", "Route Management", "Order Updates", "Customer Contact"],
  },
]

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState(null)

  const handleRoleSelect = (roleId) => {
    window.location.href = `/${roleId}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Clothify</h1>
          <nav className="flex gap-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-blue-600">Home</a>
            <a href="#" className="hover:text-blue-600">Shop</a>
            <a href="#" className="hover:text-blue-600">About</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </nav>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="mr-2 h-4 w-4" /> Cart
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-24 bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Shop Smarter, Live Better
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mb-8">
          Discover amazing products from trusted vendors. Seamless shopping for customers, full control for vendors.
        </p>
        <Button className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl">
          Start Shopping
        </Button>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-10 text-gray-900">Why Choose Clothify?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
              <Package className="mx-auto text-blue-600 mb-4 h-10 w-10" />
              <h4 className="font-bold text-lg mb-2">Wide Product Range</h4>
              <p className="text-gray-600 text-sm">Explore thousands of products from verified vendors.</p>
            </div>
            <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
              <Shield className="mx-auto text-blue-600 mb-4 h-10 w-10" />
              <h4 className="font-bold text-lg mb-2">Secure Payments</h4>
              <p className="text-gray-600 text-sm">Your transactions are encrypted and protected end-to-end.</p>
            </div>
            <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
              <Truck className="mx-auto text-blue-600 mb-4 h-10 w-10" />
              <h4 className="font-bold text-lg mb-2">Fast Delivery</h4>
              <p className="text-gray-600 text-sm">Quick, reliable shipping across multiple regions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Role Cards) */}
      <footer className="bg-gray-900 text-gray-100 mt-16 py-16">
        <div className="container mx-auto px-6 text-center mb-12">
          <h3 className="text-2xl font-semibold mb-4">Explore Role-Based Dashboards</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Choose a role to access its dashboard and see how each part of the e-commerce ecosystem works.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {roles.map((role) => {
              const IconComponent = role.icon
              return (
                <Card
                  key={role.id}
                  className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{role.title}</CardTitle>
                    <CardDescription className="text-gray-400">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 flex flex-wrap justify-center">
                      {role.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2 bg-gray-700 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRoleSelect(role.id)
                      }}
                    >
                      Enter {role.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedRole && (
            <div className="mt-8 text-center text-gray-400">
              Selected:{" "}
              <span className="font-semibold text-blue-400">
                {roles.find((r) => r.id === selectedRole)?.title}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
          © 2025 Clothify. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
