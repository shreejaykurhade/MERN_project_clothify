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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, AlertTriangle, TrendingUp, Star, Tag, MoreHorizontal, Edit, Eye, Search, Filter } from "lucide-react"

function InventoryDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    featuredItems: 0,
  })
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Load inventory data
    fetch("/mock/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setFilteredProducts(data)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product) => product.category))]
        setCategories(uniqueCategories)

        // Calculate stats
        const lowStock = data.filter((p) => p.stock > 0 && p.stock < 10).length
        const outOfStock = data.filter((p) => p.stock === 0).length
        const featured = data.filter((p) => p.featured).length

        setStats({
          totalProducts: data.length,
          lowStockItems: lowStock,
          outOfStockItems: outOfStock,
          featuredItems: featured,
        })
      })
      .catch((error) => {
        console.error("Error loading inventory data:", error)
      })
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by stock status
    if (stockFilter !== "all") {
      switch (stockFilter) {
        case "low":
          filtered = filtered.filter((product) => product.stock > 0 && product.stock < 10)
          break
        case "out":
          filtered = filtered.filter((product) => product.stock === 0)
          break
        case "in-stock":
          filtered = filtered.filter((product) => product.stock >= 10)
          break
      }
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, stockFilter, categoryFilter])

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800", priority: "high" }
    if (stock < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800", priority: "medium" }
    return { label: "In Stock", color: "bg-green-100 text-green-800", priority: "low" }
  }

  const updateStock = (productId, newStock) => {
    setProducts(products.map((product) => (product.id === productId ? { ...product, stock: newStock } : product)))
  }

  const toggleFeatured = (productId) => {
    setProducts(
      products.map((product) => (product.id === productId ? { ...product, featured: !product.featured } : product)),
    )
  }

  const addTag = (productId, tag) => {
    // Mock function to add tags to products
    console.log(`Adding tag "${tag}" to product ${productId}`)
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Inventory Portal" role="Inventory Manager">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Manager Login</CardTitle>
              <CardDescription>Please log in to access the inventory dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/inventory/login"
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
    <Layout title="Inventory Management" role="Inventory Manager">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStockItems}</p>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.featuredItems}</p>
                  <p className="text-sm text-muted-foreground">Featured Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory Overview</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            <TabsTrigger value="tagging">Product Tagging</TabsTrigger>
          </TabsList>

          {/* Inventory Overview */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>Manage stock levels and product information</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select value={stockFilter} onValueChange={setStockFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Stock Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stock</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setStockFilter("all")
                        setCategoryFilter("all")
                      }}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Products Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock)
                      return (
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
                          <TableCell>
                            <Input
                              type="number"
                              value={product.stock}
                              onChange={(e) => updateStock(product.id, Number.parseInt(e.target.value) || 0)}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <Button
                              variant={product.featured ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleFeatured(product.id)}
                            >
                              <Star className={`w-4 h-4 ${product.featured ? "fill-current" : ""}`} />
                            </Button>
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
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => addTag(product.id, "trending")}>
                                  <Tag className="w-4 h-4 mr-2" />
                                  Add Tag
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Alerts */}
          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Out of Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products
                      .filter((p) => p.stock === 0)
                      .map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <Button size="sm" onClick={() => updateStock(product.id, 10)}>
                            Restock
                          </Button>
                        </div>
                      ))}
                    {products.filter((p) => p.stock === 0).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No out of stock items</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products
                      .filter((p) => p.stock > 0 && p.stock < 10)
                      .map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • {product.stock} remaining
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStock(product.id, product.stock + 20)}
                          >
                            Restock
                          </Button>
                        </div>
                      ))}
                    {products.filter((p) => p.stock > 0 && p.stock < 10).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No low stock items</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Product Tagging */}
          <TabsContent value="tagging">
            <Card>
              <CardHeader>
                <CardTitle>Product Tagging</CardTitle>
                <CardDescription>Mark products as featured, trending, or discounted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.price}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Featured</span>
                          <Button
                            variant={product.featured ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFeatured(product.id)}
                          >
                            <Star className={`w-4 h-4 ${product.featured ? "fill-current" : ""}`} />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Trending</span>
                          <Button variant="outline" size="sm" onClick={() => addTag(product.id, "trending")}>
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Discounted</span>
                          <Button variant="outline" size="sm" onClick={() => addTag(product.id, "discounted")}>
                            <Tag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default function InventoryPage() {
  return (
    <AuthProvider>
      <InventoryDashboard />
    </AuthProvider>
  )
}
