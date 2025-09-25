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
    // In a real app, this would set user context and redirect
    window.location.href = `/${roleId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Multi-Role E-commerce Platform</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon
            return (
              <Card
                key={role.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {role.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRoleSelect(role.id)
                    }}
                  >
                    Enter {role.title} Dashboard
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedRole && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Selected: <span className="font-semibold">{roles.find((r) => r.id === selectedRole)?.title}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
