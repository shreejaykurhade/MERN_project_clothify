"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Heart, Package, Star } from "lucide-react"

function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    cartItems: 0,
    recentOrders: [],
  })

  useEffect(() => {
    // Load customer stats from localStorage and mock data
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

    setStats({
      totalOrders: 2,
      wishlistItems: wishlist.length,
      cartItems: cart.reduce((total, item) => total + item.quantity, 0),
      recentOrders: [
        { id: 1001, date: "2024-03-15", total: 199.99, status: "pending" },
        { id: 1002, date: "2024-03-10", total: 369.97, status: "shipped" },
      ],
    })
  }, [])

  if (!isAuthenticated) {
    return (
      <Layout title="Customer Portal" role="Customer">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Customer Login</CardTitle>
              <CardDescription>Please log in to access your customer dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/customer/login"
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
    <Layout title="Customer Dashboard" role="Customer">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-500" />
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
                <ShoppingCart className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.cartItems}</p>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.wishlistItems}</p>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">4.5</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" onClick={() => (window.location.href = "/customer/catalog")}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/customer/cart")}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/customer/orders")}
              >
                <Package className="w-4 h-4 mr-2" />
                Order History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => (window.location.href = "/customer/wishlist")}
              >
                <Heart className="w-4 h-4 mr-2" />
                My Wishlist
              </Button>
            </CardContent>
          </Card>

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
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "shipped" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default function CustomerPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomerDashboard />
      </CartProvider>
    </AuthProvider>
  )
}
