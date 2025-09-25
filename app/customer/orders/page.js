"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Eye, Star } from "lucide-react"

function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Load orders from localStorage and mock data
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const mockOrders = [
      {
        id: 1001,
        orderDate: "2024-03-15T10:30:00Z",
        status: "pending",
        total: 199.99,
        items: [
          {
            productId: 1,
            name: "Wireless Bluetooth Headphones",
            price: 199.99,
            quantity: 1,
          },
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      },
      {
        id: 1002,
        orderDate: "2024-03-10T14:20:00Z",
        status: "delivered",
        total: 369.97,
        items: [
          {
            productId: 3,
            name: "Smart Fitness Watch",
            price: 299.99,
            quantity: 1,
          },
          {
            productId: 6,
            name: "Stainless Steel Water Bottle",
            price: 34.99,
            quantity: 2,
          },
        ],
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      },
    ]

    setOrders([...mockOrders, ...savedOrders])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (orders.length === 0) {
    return (
      <Layout title="Order History" role="Customer">
        <div className="text-center py-12">
          <Package className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">When you place orders, they will appear here.</p>
          <Button onClick={() => (window.location.href = "/customer/catalog")}>Start Shopping</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Order History" role="Customer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Orders</h2>
          <p className="text-muted-foreground">{orders.length} orders total</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-lg font-semibold mt-1">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Write Review
                      </Button>
                    )}
                    {order.status === "pending" && (
                      <Button variant="outline" size="sm">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default function CustomerOrdersPage() {
  return (
    <AuthProvider>
      <OrdersPage />
    </AuthProvider>
  )
}
