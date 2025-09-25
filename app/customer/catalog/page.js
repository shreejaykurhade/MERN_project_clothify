"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import Layout from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Load products from mock data
    fetch("/mock/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setFilteredProducts(data)
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product) => product.category))]
        setCategories(uniqueCategories)
      })
      .catch((error) => {
        console.error("Error loading products:", error)
        // Fallback to empty array
        setProducts([])
        setFilteredProducts([])
      })
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-50":
          filtered = filtered.filter((product) => product.price < 50)
          break
        case "50-200":
          filtered = filtered.filter((product) => product.price >= 50 && product.price <= 200)
          break
        case "over-200":
          filtered = filtered.filter((product) => product.price > 200)
          break
      }
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange("all")
    setSortBy("name")
  }

  return (
    <Layout title="Product Catalog" role="Customer">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-200">$50 - $200</SelectItem>
                <SelectItem value="over-200">Over $200</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex gap-2 flex-wrap">
          {searchTerm && (
            <Badge variant="secondary">
              Search: {searchTerm}
              <button className="ml-2" onClick={() => setSearchTerm("")}>
                ×
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary">
              Category: {selectedCategory}
              <button className="ml-2" onClick={() => setSelectedCategory("all")}>
                ×
              </button>
            </Badge>
          )}
          {priceRange !== "all" && (
            <Badge variant="secondary">
              Price: {priceRange}
              <button className="ml-2" onClick={() => setPriceRange("all")}>
                ×
              </button>
            </Badge>
          )}
        </div>

        {/* Results Count */}
        <div className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default function CustomerCatalogPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CatalogPage />
      </CartProvider>
    </AuthProvider>
  )
}
