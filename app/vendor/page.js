"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthProvider } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Store, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

function VendorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    recentOrders: [],
    topProducts: [],
  })

  useEffect(() => {
    // Load vendor stats from mock data
    const mockStats = {
      totalProducts: 12,
      totalOrders: 45,
      totalRevenue: 8750.25,
      lowStockItems: 3,
      recentOrders: [
        { id: 1001, customer: "John Customer", total: 199.99, status: "pending", date: "2024-03-15" },
        { id: 1003, customer: "Jane Smith", total: 89.99, status: "processing", date: "2024-03-14" },
        { id: 1004, customer: "Bob Johnson", total: 299.99, status: "shipped", date: "2024-03-13" },
      ],
      topProducts: [
        { name: "Wireless Bluetooth Headphones", sales: 25, revenue: 4999.75 },
        { name: "Smart Fitness Watch", sales: 15, revenue: 4499.85 },
        { name: "Stainless Steel Water Bottle", sales: 30, revenue: 1049.7 },
      ],
    }
    setStats(mockStats)
  }, [])

  if (!isAuthenticated) {
    return (
      <Layout title="Vendor Portal" role="Vendor">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Login</CardTitle>
              <CardDescription>Please log in to access your vendor dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/vendor/login"
                }}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Vendor Dashboard" role="Vendor">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => (window.location.href = "/vendor/products/add")}>
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/vendor/products")}
              >
                <Store className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/vendor/orders")}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/vendor/analytics")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <Badge
                        className={
                          order.status === "shipped"
                            ? "bg-green-100 text-green-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default function VendorPage() {
  return (
    <AuthProvider>
      <VendorDashboard />
    </AuthProvider>
  )
}
