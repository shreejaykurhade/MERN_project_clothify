"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthProvider } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Truck, Package, MapPin, Clock, CheckCircle, Phone, Navigation, Eye, RotateCcw } from "lucide-react"

function DeliveryDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    assignedOrders: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    totalDistance: 0,
  })
  const [assignedOrders, setAssignedOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [otpInput, setOtpInput] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)

  useEffect(() => {
    // Load delivery agent data
    const mockAssignedOrders = [
      {
        id: 1001,
        customerId: 1,
        customerName: "John Customer",
        customerPhone: "+1 (555) 123-4567",
        items: [
          {
            productId: 1,
            name: "Wireless Bluetooth Headphones",
            price: 199.99,
            quantity: 1,
          },
        ],
        total: 199.99,
        status: "assigned",
        assignedDate: "2024-03-16T08:00:00Z",
        estimatedDelivery: "2024-03-16T16:00:00Z",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        otp: "1234",
        priority: "normal",
        distance: "2.5 miles",
      },
      {
        id: 1002,
        customerId: 2,
        customerName: "Jane Smith",
        customerPhone: "+1 (555) 987-6543",
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
        total: 369.97,
        status: "in-transit",
        assignedDate: "2024-03-16T09:30:00Z",
        estimatedDelivery: "2024-03-16T17:30:00Z",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        otp: "5678",
        priority: "high",
        distance: "4.2 miles",
      },
      {
        id: 1003,
        customerId: 3,
        customerName: "Bob Johnson",
        customerPhone: "+1 (555) 456-7890",
        items: [
          {
            productId: 4,
            name: "Artisan Coffee Beans",
            price: 24.99,
            quantity: 3,
          },
        ],
        total: 74.97,
        status: "delivered",
        assignedDate: "2024-03-15T10:00:00Z",
        deliveredDate: "2024-03-15T15:30:00Z",
        shippingAddress: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
        otp: "9012",
        priority: "normal",
        distance: "1.8 miles",
      },
    ]

    setAssignedOrders(mockAssignedOrders)

    // Calculate stats
    const assigned = mockAssignedOrders.filter(
      (order) => order.status === "assigned" || order.status === "in-transit",
    ).length
    const completed = mockAssignedOrders.filter((order) => order.status === "delivered").length
    const pending = mockAssignedOrders.filter((order) => order.status === "assigned").length

    setStats({
      assignedOrders: assigned,
      completedToday: completed,
      pendingDeliveries: pending,
      totalDistance: 8.5,
    })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setAssignedOrders(
      assignedOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              ...(newStatus === "delivered" && { deliveredDate: new Date().toISOString() }),
            }
          : order,
      ),
    )

    // Update stats
    if (newStatus === "delivered") {
      setStats({
        ...stats,
        completedToday: stats.completedToday + 1,
        assignedOrders: stats.assignedOrders - 1,
      })
    }
  }

  const handleStartDelivery = (orderId) => {
    updateOrderStatus(orderId, "in-transit")
  }

  const handleCompleteDelivery = (order) => {
    setSelectedOrder(order)
    setShowOtpModal(true)
  }

  const handleOtpVerification = () => {
    if (otpInput === selectedOrder.otp) {
      updateOrderStatus(selectedOrder.id, "delivered")
      setShowOtpModal(false)
      setOtpInput("")
      setSelectedOrder(null)
    } else {
      alert("Invalid OTP. Please try again.")
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Delivery Portal" role="Delivery Agent">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Agent Login</CardTitle>
              <CardDescription>Please log in to access your delivery dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/delivery/login"
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
    <Layout title="Delivery Dashboard" role="Delivery Agent">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.assignedOrders}</p>
                  <p className="text-sm text-muted-foreground">Assigned Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingDeliveries}</p>
                  <p className="text-sm text-muted-foreground">Pending Deliveries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Navigation className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalDistance}</p>
                  <p className="text-sm text-muted-foreground">Miles Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Assigned Orders</TabsTrigger>
            <TabsTrigger value="route">Route Planning</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Assigned Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Orders</CardTitle>
                <CardDescription>Manage your assigned deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedOrders
                      .filter((order) => order.status !== "delivered")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {order.customerPhone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-sm">{order.shippingAddress.street}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                  {order.shippingAddress.zipCode}
                                </p>
                                <p className="text-xs text-muted-foreground">{order.distance}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.name} × {item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{formatDate(order.estimatedDelivery)}</p>
                              <p className="text-muted-foreground">{formatTime(order.estimatedDelivery)}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              {order.status === "assigned" && (
                                <Button size="sm" onClick={() => handleStartDelivery(order.id)}>
                                  <Truck className="w-4 h-4 mr-2" />
                                  Start
                                </Button>
                              )}
                              {order.status === "in-transit" && (
                                <Button size="sm" onClick={() => handleCompleteDelivery(order)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Complete
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {assignedOrders.filter((order) => order.status !== "delivered").length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assigned orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Planning */}
          <TabsContent value="route">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Route</CardTitle>
                  <CardDescription>Optimized delivery route for maximum efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedOrders
                      .filter((order) => order.status !== "delivered")
                      .sort((a, b) => (a.priority === "high" ? -1 : 1))
                      .map((order, index) => (
                        <div key={order.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.distance} • ETA: {formatTime(order.estimatedDelivery)}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Map</CardTitle>
                  <CardDescription>Interactive map with delivery locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">Map integration would be implemented here</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button className="w-full">
                      <Navigation className="w-4 h-4 mr-2" />
                      Start Navigation
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Optimize Route
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Delivery History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>Your completed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedOrders
                      .filter((order) => order.status === "delivered")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{order.shippingAddress.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.city}, {order.shippingAddress.state}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{formatDate(order.deliveredDate)}</p>
                              <p className="text-muted-foreground">{formatTime(order.deliveredDate)}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>Delivered</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {assignedOrders.filter((order) => order.status === "delivered").length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed deliveries yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* OTP Verification Modal */}
        {showOtpModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Delivery
                </CardTitle>
                <CardDescription>Enter the OTP provided by the customer to complete the delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Order #{selectedOrder.id}</p>
                  <p className="text-sm text-muted-foreground">Customer: {selectedOrder.customerName}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="otp">Customer OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    maxLength={4}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">Ask the customer for their delivery OTP</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleOtpVerification} className="flex-1" disabled={otpInput.length !== 4}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Delivery
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowOtpModal(false)
                      setOtpInput("")
                      setSelectedOrder(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default function DeliveryPage() {
  return (
    <AuthProvider>
      <DeliveryDashboard />
    </AuthProvider>
  )
}
