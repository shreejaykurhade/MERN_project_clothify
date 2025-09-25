"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ product, showActions = true }) {
  const { addToCart, addToWishlist } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
    setIsWishlisted(true)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="text-muted-foreground">No Image</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          {product.featured && (
            <Badge variant="secondary" className="ml-2">
              Featured
            </Badge>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || 0)}
            <span className="text-sm text-muted-foreground ml-1">({product.reviews || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Stock: {product.stock || 0}</span>
          <span>{product.category}</span>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="p-4 pt-0 flex space-x-2">
          <Button className="flex-1" onClick={handleAddToCart} disabled={!product.stock}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" onClick={handleAddToWishlist} disabled={isWishlisted}>
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
