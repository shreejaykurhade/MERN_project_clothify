"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Package, Truck } from "lucide-react"

function VendorOrdersPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Load vendor orders from mock data
    const mockOrders = [
      {
        id: 1001,
        customerId: 1,
        customerName: "John Customer",
        customerEmail: "customer@example.com",
        items: [
          {
            productId: 1,
            name: "Wireless Bluetooth Headphones",
            price: 199.99,
            quantity: 1,
          },
        ],
        total: 199.99,
        status: "pending",
        orderDate: "2024-03-15T10:30:00Z",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      },
      {
        id: 1003,
        customerId: 2,
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        items: [
          {
            productId: 3,
            name: "Smart Fitness Watch",
            price: 299.99,
            quantity: 1,
          },
        ],
        total: 299.99,
        status: "processing",
        orderDate: "2024-03-14T14:20:00Z",
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
        },
      },
      {
        id: 1004,
        customerId: 3,
        customerName: "Bob Johnson",
        customerEmail: "bob@example.com",
        items: [
          {
            productId: 1,
            name: "Wireless Bluetooth Headphones",
            price: 199.99,
            quantity: 2,
          },
        ],
        total: 399.98,
        status: "shipped",
        orderDate: "2024-03-13T09:15:00Z",
        shippingAddress: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
        },
      },
    ]

    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter))
    }
  }, [orders, statusFilter])

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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Layout title="Order Management" role="Vendor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Order Management</h2>
            <p className="text-muted-foreground">{filteredOrders.length} orders</p>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
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
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                              <Package className="w-4 h-4 mr-2" />
                              Mark as Processing
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                              <Truck className="w-4 h-4 mr-2" />
                              Mark as Shipped
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders found.</p>
                {statusFilter !== "all" && (
                  <Button variant="outline" onClick={() => setStatusFilter("all")} className="mt-2">
                    Show All Orders
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default function VendorOrdersPageWrapper() {
  return (
    <AuthProvider>
      <VendorOrdersPage />
    </AuthProvider>
  )
}
