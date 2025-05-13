"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { CheckCircle, Clock } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

type Order = {
  id: string
  guestId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  status: string
  total: number
  createdAt: any
  paymentMethod: string
  paymentStatus: string
}

export default function OrderConfirmation() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Only run this effect when the router is ready
    if (!router.isReady) return

    const orderId = router.query.id as string

    // If there's no order ID, show a generic success message
    if (!orderId) {
      setLoading(false)
      return
    }

    // Try to find the order in localStorage
    try {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        const orders = JSON.parse(savedOrders)
        const foundOrder = orders.find((o: any) => o.id === orderId)

        if (foundOrder) {
          setOrder(foundOrder)
        } else {
          setError("Order not found")
        }
      } else {
        setError("No orders found")
      }
    } catch (err) {
      console.error("Error retrieving order:", err)
      setError("Failed to load order details")
    } finally {
      setLoading(false)
    }
  }, [router.isReady, router.query])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // If no order data is available yet, show a generic success message
  if (!order) {
    return (
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
            <p className="text-gray-600 mb-6">Your order has been successfully placed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Order More
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Format the date safely
  const formatDate = (timestamp: any) => {
    try {
      if (!timestamp) return "N/A"
      return new Date(timestamp).toLocaleString()
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Your order has been received and is being processed. We'll notify you when it's ready.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Order #{order.id ? order.id.slice(-6).toUpperCase() : "PENDING"}
                </h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Processing"}
                </span>
              </div>
              <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold mb-4">Order Details</h3>
              {order.items && order.items.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item: any, index: number) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No items in this order.</p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${((order.total || 0) / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>${((order.total || 0) - (order.total || 0) / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p>{order.customerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p>{order.customerEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p>{order.customerPhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Method</p>
                  <p>
                    {order.paymentMethod === "cash"
                      ? "Cash on Delivery"
                      : order.paymentMethod === "card"
                        ? "Card on Delivery"
                        : "Online Payment"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-semibold mb-4">Order Status</h3>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Your order is being prepared. Estimated time: 30-45 minutes.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Order More
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
