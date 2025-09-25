"use client"

import { useState } from "react"
import { AuthProvider } from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X } from "lucide-react"

function AddProductPage() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverage",
    "Furniture",
    "Sports & Outdoors",
    "Books",
    "Beauty & Personal Care",
    "Home & Garden",
    "Toys & Games",
    "Automotive",
  ]

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map((file) => URL.createObjectURL(file))
    setProductData({
      ...productData,
      images: [...productData.images, ...imageUrls].slice(0, 5), // Max 5 images
    })
  }

  const removeImage = (index) => {
    const newImages = productData.images.filter((_, i) => i !== index)
    setProductData({ ...productData, images: newImages })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (Number.parseFloat(productData.price) <= 0) {
      setError("Price must be greater than 0")
      setIsLoading(false)
      return
    }

    if (Number.parseInt(productData.stock) < 0) {
      setError("Stock cannot be negative")
      setIsLoading(false)
      return
    }

    // Mock product creation
    const newProduct = {
      id: Date.now(),
      ...productData,
      price: Number.parseFloat(productData.price),
      stock: Number.parseInt(productData.stock) || 0,
      vendorId: 1, // Mock vendor ID
      rating: 0,
      reviews: 0,
      featured: false,
      image: productData.images[0] || "/placeholder.svg?height=300&width=300",
    }

    // In a real app, this would be sent to the backend
    console.log("Creating product:", newProduct)

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setIsLoading(false)
      // Reset form
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        images: [],
      })
    }, 1000)
  }

  return (
    <Layout title="Add New Product" role="Vendor">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  placeholder="Describe your product"
                  rows={4}
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => setProductData({ ...productData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images (Max 5)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Click to upload images</span>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                {productData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>Product added successfully!</AlertDescription>
                </Alert>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Adding Product..." : "Add Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (window.location.href = "/vendor/products")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default function VendorAddProductPage() {
  return (
    <AuthProvider>
      <AddProductPage />
    </AuthProvider>
  )
}
