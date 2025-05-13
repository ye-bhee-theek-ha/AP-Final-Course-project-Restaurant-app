"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useCart } from "./cart-context"

type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"

export type Order = {
  id: string
  guestId?: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    options?: Record<string, string>
  }[]
  status: OrderStatus
  total: number
  createdAt: any
  updatedAt: any
  customerName: string
  customerPhone: string
  customerEmail: string
  deliveryAddress?: string
  tableNumber?: string
  specialInstructions?: string
  paymentMethod: "cash" | "card" | "online"
  paymentStatus: "pending" | "paid" | "failed"
}

type OrderContextType = {
  currentOrder: Order | null
  orders: Order[]
  loading: boolean
  error: string | null
  placeOrder: (orderDetails: Partial<Order>) => Promise<string>
  cancelOrder: (orderId: string) => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { items, subtotal, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate a guest ID if one doesn't exist in localStorage
  const getGuestId = () => {
    if (typeof window === "undefined") return "guest_temp"

    let guestId = localStorage.getItem("guestId")
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("guestId", guestId)
    }
    return guestId
  }

  // Load orders from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders)
        setOrders(parsedOrders)

        // Find current order if any
        const now = new Date()
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

        const latestOrder = parsedOrders[0]
        if (latestOrder) {
          const orderDate = new Date(latestOrder.createdAt)
          const isRecent = orderDate > twoHoursAgo
          const isActive = ["pending", "confirmed", "preparing", "ready"].includes(latestOrder.status)

          if (isRecent && isActive) {
            setCurrentOrder(latestOrder)
          }
        }
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || orders.length === 0) return
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const placeOrder = async (orderDetails: Partial<Order>): Promise<string> => {
    if (items.length === 0) {
      throw new Error("Your cart is empty")
    }

    try {
      setLoading(true)
      setError(null)

      const guestId = getGuestId()
      const orderId = "order_" + Math.random().toString(36).substring(2, 15)
      const now = new Date().toISOString()

      const newOrder: Order = {
        id: orderId,
        guestId,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
        })),
        status: "pending",
        total: subtotal * 1.08, // Adding tax
        createdAt: now,
        updatedAt: now,
        customerName: orderDetails.customerName || "",
        customerEmail: orderDetails.customerEmail || "",
        customerPhone: orderDetails.customerPhone || "",
        deliveryAddress: orderDetails.deliveryAddress,
        specialInstructions: orderDetails.specialInstructions,
        paymentMethod: orderDetails.paymentMethod || "cash",
        paymentStatus: "pending",
      }

      // Add to beginning of orders array
      setOrders((prev) => [newOrder, ...prev])
      setCurrentOrder(newOrder)

      // Clear the cart after successful order
      clearCart()

      return orderId
    } catch (err) {
      console.error("Error placing order:", err)
      setError("Failed to place order")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Update the order status to 'cancelled' in local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)),
      )

      if (currentOrder?.id === orderId) {
        setCurrentOrder(null)
      }
    } catch (err) {
      console.error("Error cancelling order:", err)
      setError("Failed to cancel order")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentOrder,
    orders,
    loading,
    error,
    placeOrder,
    cancelOrder,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
