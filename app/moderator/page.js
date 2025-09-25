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
import { Eye, Flag, Check, X, AlertTriangle, MessageSquare, Star } from "lucide-react"

function ModeratorDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    pendingReviews: 0,
    flaggedContent: 0,
    approvedToday: 0,
    rejectedToday: 0,
  })
  const [pendingReviews, setPendingReviews] = useState([])
  const [flaggedProducts, setFlaggedProducts] = useState([])
  const [reportedContent, setReportedContent] = useState([])

  useEffect(() => {
    // Load moderator data
    const mockPendingReviews = [
      {
        id: 1,
        productId: 1,
        productName: "Wireless Bluetooth Headphones",
        customerName: "John Customer",
        rating: 5,
        comment: "Amazing headphones! Great sound quality and battery life. Highly recommended!",
        date: "2024-03-16T10:30:00Z",
        status: "pending",
      },
      {
        id: 2,
        productId: 3,
        productName: "Smart Fitness Watch",
        customerName: "Jane Smith",
        rating: 2,
        comment: "The watch is okay but the battery doesn't last as long as advertised. Also had connectivity issues.",
        date: "2024-03-16T09:15:00Z",
        status: "pending",
      },
      {
        id: 3,
        productId: 2,
        productName: "Organic Cotton T-Shirt",
        customerName: "Bob Johnson",
        rating: 4,
        comment: "Good quality shirt, very comfortable. The sizing runs a bit small though.",
        date: "2024-03-15T16:45:00Z",
        status: "pending",
      },
    ]

    const mockFlaggedProducts = [
      {
        id: 4,
        name: "Suspicious Electronics Device",
        vendorName: "Unknown Vendor",
        reason: "Potentially counterfeit product",
        reportedBy: "Customer Report",
        date: "2024-03-16T08:00:00Z",
        status: "flagged",
      },
      {
        id: 6,
        name: "Overpriced Water Bottle",
        vendorName: "Greedy Store",
        reason: "Price manipulation",
        reportedBy: "System Alert",
        date: "2024-03-15T14:30:00Z",
        status: "flagged",
      },
    ]

    const mockReportedContent = [
      {
        id: 1,
        type: "review",
        content: "This product is terrible and the seller is a scammer!",
        reportReason: "Inappropriate language",
        reportedBy: "User123",
        date: "2024-03-16T11:20:00Z",
        status: "pending",
      },
      {
        id: 2,
        type: "product_description",
        content: "Best product ever! Buy now or regret forever! Limited time offer!",
        reportReason: "Misleading advertising",
        reportedBy: "Competitor",
        date: "2024-03-15T13:10:00Z",
        status: "pending",
      },
    ]

    setPendingReviews(mockPendingReviews)
    setFlaggedProducts(mockFlaggedProducts)
    setReportedContent(mockReportedContent)

    setStats({
      pendingReviews: mockPendingReviews.length,
      flaggedContent: mockFlaggedProducts.length + mockReportedContent.length,
      approvedToday: 12,
      rejectedToday: 3,
    })
  }, [])

  const handleReviewAction = (reviewId, action, reason = "") => {
    setPendingReviews(pendingReviews.filter((review) => review.id !== reviewId))
    setStats({
      ...stats,
      pendingReviews: stats.pendingReviews - 1,
      approvedToday: action === "approve" ? stats.approvedToday + 1 : stats.approvedToday,
      rejectedToday: action === "reject" ? stats.rejectedToday + 1 : stats.rejectedToday,
    })
    console.log(`Review ${reviewId} ${action}ed${reason ? ` - Reason: ${reason}` : ""}`)
  }

  const handleContentAction = (contentId, action, type) => {
    if (type === "product") {
      setFlaggedProducts(flaggedProducts.filter((product) => product.id !== contentId))
    } else {
      setReportedContent(reportedContent.filter((content) => content.id !== contentId))
    }
    setStats({ ...stats, flaggedContent: stats.flaggedContent - 1 })
    console.log(`Content ${contentId} ${action}ed`)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Moderator Portal" role="Moderator">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Moderator Login</CardTitle>
              <CardDescription>Please log in to access the moderation dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/moderator/login"
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
    <Layout title="Moderation Dashboard" role="Moderator">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Flag className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.flaggedContent}</p>
                  <p className="text-sm text-muted-foreground">Flagged Content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Check className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.approvedToday}</p>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <X className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejectedToday}</p>
                  <p className="text-sm text-muted-foreground">Rejected Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reviews">Review Moderation</TabsTrigger>
            <TabsTrigger value="products">Flagged Products</TabsTrigger>
            <TabsTrigger value="content">Reported Content</TabsTrigger>
          </TabsList>

          {/* Review Moderation */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Review Moderation</CardTitle>
                <CardDescription>Review and moderate customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending reviews</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{review.productName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Review by {review.customerName} • {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">Pending Review</Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Review Comment:</p>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleReviewAction(review.id, "approve")}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewAction(review.id, "reject", "Inappropriate content")}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                            <Button variant="outline" size="sm">
                              <Flag className="w-4 h-4 mr-2" />
                              Flag for Review
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

          {/* Flagged Products */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Products</CardTitle>
                <CardDescription>Review products that have been flagged for issues</CardDescription>
              </CardHeader>
              <CardContent>
                {flaggedProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No flagged products</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flaggedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.vendorName}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{product.reason}</Badge>
                          </TableCell>
                          <TableCell>{product.reportedBy}</TableCell>
                          <TableCell>{new Date(product.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex space-x-2 justify-end">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                              <Button size="sm" onClick={() => handleContentAction(product.id, "approve", "product")}>
                                <Check className="w-4 h-4 mr-2" />
                                Clear
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleContentAction(product.id, "remove", "product")}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reported Content */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>Review content that has been reported by users</CardDescription>
              </CardHeader>
              <CardContent>
                {reportedContent.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reported content</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportedContent.map((content) => (
                      <div key={content.id} className="border rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge variant="outline">{content.type.replace("_", " ")}</Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                Reported by {content.reportedBy} • {new Date(content.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="destructive">{content.reportReason}</Badge>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Reported Content:</p>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">{content.content}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleContentAction(content.id, "approve", "content")}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleContentAction(content.id, "remove", "content")}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Context
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
        </Tabs>
      </div>
    </Layout>
  )
}

export default function ModeratorPage() {
  return (
    <AuthProvider>
      <ModeratorDashboard />
    </AuthProvider>
  )
}
