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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  Check,
  X,
  Eye,
} from "lucide-react"

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeOrders: 0,
  })
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [pendingVendors, setPendingVendors] = useState([])

  useEffect(() => {
    // Load admin data from mock sources
    Promise.all([
      fetch("/mock/users.json").then((res) => res.json()),
      fetch("/mock/products.json").then((res) => res.json()),
    ])
      .then(([usersData, productsData]) => {
        const vendorsData = usersData.filter((user) => user.role === "vendor")
        const customersData = usersData.filter((user) => user.role === "customer")

        setUsers(usersData)
        setVendors(vendorsData)
        setProducts(productsData)

        // Mock pending vendors
        const mockPendingVendors = [
          {
            id: 10,
            name: "New Vendor 1",
            email: "newvendor1@example.com",
            storeName: "Tech Store Plus",
            storeDescription: "Latest technology products and gadgets",
            applicationDate: "2024-03-16",
            status: "pending",
          },
          {
            id: 11,
            name: "New Vendor 2",
            email: "newvendor2@example.com",
            storeName: "Fashion Hub",
            storeDescription: "Trendy clothing and accessories",
            applicationDate: "2024-03-15",
            status: "pending",
          },
        ]
        setPendingVendors(mockPendingVendors)

        setStats({
          totalUsers: usersData.length,
          totalVendors: vendorsData.length,
          totalProducts: productsData.length,
          totalRevenue: 125750.5,
          pendingApprovals: mockPendingVendors.length,
          activeOrders: 23,
        })
      })
      .catch((error) => {
        console.error("Error loading admin data:", error)
      })
  }, [])

  const handleVendorApproval = (vendorId, approved) => {
    setPendingVendors(pendingVendors.filter((vendor) => vendor.id !== vendorId))
    setStats({ ...stats, pendingApprovals: stats.pendingApprovals - 1 })

    if (approved) {
      // In a real app, this would create the vendor account
      console.log(`Vendor ${vendorId} approved`)
    } else {
      console.log(`Vendor ${vendorId} rejected`)
    }
  }

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Admin Portal" role="Admin">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Please log in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/admin/login"
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
    <Layout title="Admin Dashboard" role="Admin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Store className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalVendors}</p>
                  <p className="text-sm text-muted-foreground">Active Vendors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-purple-500" />
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
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-teal-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeOrders}</p>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
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
                                View Profile
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleUserStatusChange(user.id, "suspended")}
                                >
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserStatusChange(user.id, "active")}>
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Management */}
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage vendor accounts and stores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Store ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.storeId || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              vendor.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{vendor.joinDate}</TableCell>
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
                                View Store
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Products</DropdownMenuItem>
                              <DropdownMenuItem>View Orders</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage all products on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.vendorId}</TableCell>
                        <TableCell>
                          <Badge
                            className={product.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}
                          >
                            {product.featured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem>
                                {product.featured ? "Remove from Featured" : "Mark as Featured"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove Product</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Approvals */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve vendor applications</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingVendors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVendors.map((vendor) => (
                      <div key={vendor.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold">{vendor.name}</h4>
                              <p className="text-sm text-muted-foreground">{vendor.email}</p>
                            </div>
                            <div>
                              <p className="font-medium">Store: {vendor.storeName}</p>
                              <p className="text-sm text-muted-foreground">{vendor.storeDescription}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Applied: {vendor.applicationDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleVendorApproval(vendor.id, true)}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleVendorApproval(vendor.id, false)}>
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-semibold">{users.filter((u) => u.status === "active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Vendors</span>
                    <span className="font-semibold">{vendors.filter((v) => v.status === "active").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Products</span>
                    <span className="font-semibold">{stats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Featured Products</span>
                    <span className="font-semibold">{products.filter((p) => p.featured).length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">New vendor application</p>
                      <p className="text-muted-foreground">Tech Store Plus - 2 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Product reported</p>
                      <p className="text-muted-foreground">Wireless Headphones - 4 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">User suspended</p>
                      <p className="text-muted-foreground">Spam account - 6 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Vendor approved</p>
                      <p className="text-muted-foreground">Fashion Hub - 1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  )
}
