"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { AuthProvider } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package } from "lucide-react"

function InventoryLoginForm() {
  const { login } = useAuth()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Mock inventory manager login validation
    if (loginData.email === "inventory@example.com" && loginData.password === "inv123") {
      login(
        {
          id: 5,
          name: "Inventory Manager",
          email: loginData.email,
        },
        "inventory",
      )
      window.location.href = "/inventory"
    } else {
      setError("Invalid inventory manager credentials. Try inventory@example.com / inv123")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Inventory Manager Portal</CardTitle>
          <CardDescription>Sign in to access the inventory management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Manager Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="inventory@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="inv123"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In as Inventory Manager"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Credentials:</strong>
              <br />
              Email: inventory@example.com
              <br />
              Password: inv123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryLoginPage() {
  return (
    <AuthProvider>
      <InventoryLoginForm />
    </AuthProvider>
  )
}
