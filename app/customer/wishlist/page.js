"use client"

import { AuthProvider } from "@/context/AuthContext"
import { CartProvider, useCart } from "@/context/CartContext"
import Layout from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useCart()

  if (wishlist.length === 0) {
    return (
      <Layout title="My Wishlist" role="Customer">
        <div className="text-center py-12">
          <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love for later!</p>
          <Button onClick={() => (window.location.href = "/customer/catalog")}>Browse Products</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="My Wishlist" role="Customer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Wishlist</h2>
          <p className="text-muted-foreground">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                onClick={() => removeFromWishlist(product.id)}
              >
                <Heart className="w-4 h-4 fill-current text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default function CustomerWishlistPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistPage />
      </CartProvider>
    </AuthProvider>
  )
}
