"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useOrder } from "@/contexts/order-context"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ClientOnly from "@/components/client-only"

function CartContent() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const { placeOrder, loading } = useOrder()
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "payment">("cart")
  const [orderDetails, setOrderDetails] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    specialInstructions: "",
    paymentMethod: "cash" as "cash" | "card" | "online",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!orderDetails.customerName.trim()) {
      newErrors.customerName = "Name is required"
    }

    if (!orderDetails.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(orderDetails.customerEmail)) {
      newErrors.customerEmail = "Email is invalid"
    }

    if (!orderDetails.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToDetails = () => {
    if (items.length === 0) return
    setCheckoutStep("details")
  }

  const handleContinueToPayment = () => {
    if (validateForm()) {
      setCheckoutStep("payment")
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    try {
      const orderId = await placeOrder({
        customerName: orderDetails.customerName,
        customerEmail: orderDetails.customerEmail,
        customerPhone: orderDetails.customerPhone,
        deliveryAddress: orderDetails.deliveryAddress,
        specialInstructions: orderDetails.specialInstructions,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: "pending",
      })

      // Redirect to order confirmation page
      router.push(`/order-confirmation?id=${orderId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("There was an error placing your order. Please try again.")
    }
  }

  const handleBackToCart = () => {
    setCheckoutStep("cart")
  }

  const handleBackToDetails = () => {
    setCheckoutStep("details")
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/menu" className="text-primary hover:underline inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">
            {checkoutStep === "cart" ? "Your Cart" : checkoutStep === "details" ? "Order Details" : "Payment"}
          </h1>

          {/* Checkout Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  checkoutStep === "cart" ? "bg-primary text-white" : "bg-primary text-white"
                } mr-2`}
              >
                1
              </div>
              <span className={`mr-4 ${checkoutStep === "cart" ? "font-medium" : ""}`}>Cart</span>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  checkoutStep === "details" || checkoutStep === "payment"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                } mx-2`}
              >
                2
              </div>
              <span className={`mr-4 ${checkoutStep === "details" ? "font-medium" : ""}`}>Details</span>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  checkoutStep === "payment" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                } ml-2`}
              >
                3
              </div>
              <span className={checkoutStep === "payment" ? "font-medium" : ""}>Payment</span>
            </div>
          </div>

          {/* Cart Items */}
          {checkoutStep === "cart" && (
            <>
              {items.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Item Image */}
                          <div className="relative h-24 w-24 rounded-md overflow-hidden mb-4 sm:mb-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 sm:ml-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                {item.options && Object.keys(item.options).length > 0 && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    {Object.entries(item.options).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="font-medium">{key}:</span> {value}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 sm:mt-0 text-lg font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                              {/* Quantity Controls */}
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="mx-3 text-gray-700">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-800 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Cart Summary */}
                  <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Estimated Tax</span>
                      <span className="text-gray-900 font-medium">${(subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(subtotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                  <Link
                    href="/menu"
                    className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              )}

              {/* Cart Actions */}
              {items.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={() => clearCart()}
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleContinueToDetails}
                    className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Continue to Details
                  </button>
                </div>
              )}
            </>
          )}

          {/* Order Details Form */}
          {checkoutStep === "details" && (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={orderDetails.customerName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.customerName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary"
                        }`}
                      />
                      {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
                    </div>
                    <div>
                      <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="customerEmail"
                        name="customerEmail"
                        value={orderDetails.customerEmail}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.customerEmail
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary"
                        }`}
                      />
                      {errors.customerEmail && <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>}
                    </div>
                    <div>
                      <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={orderDetails.customerPhone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.customerPhone
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary"
                        }`}
                      />
                      {errors.customerPhone && <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>}
                    </div>
                    <div>
                      <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address (Optional)
                      </label>
                      <input
                        type="text"
                        id="deliveryAddress"
                        name="deliveryAddress"
                        value={orderDetails.deliveryAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows={3}
                      value={orderDetails.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Allergies, special requests, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({items.length} items)</span>
                      <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="text-gray-900 font-medium">${(subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(subtotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={handleBackToCart}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={handleContinueToPayment}
                  className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </>
          )}

          {/* Payment */}
          {checkoutStep === "payment" && (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="payment-cash"
                        name="paymentMethod"
                        type="radio"
                        value="cash"
                        checked={orderDetails.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="payment-cash" className="ml-3 block text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="payment-card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        checked={orderDetails.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="payment-card" className="ml-3 block text-gray-700">
                        Pay with Card on Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="payment-online"
                        name="paymentMethod"
                        type="radio"
                        value="online"
                        checked={orderDetails.paymentMethod === "online"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="payment-online" className="ml-3 block text-gray-700">
                        Pay Online Now
                      </label>
                    </div>
                  </div>

                  {orderDetails.paymentMethod === "online" && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <p className="text-gray-700 mb-4">
                        In a real application, this would integrate with a payment processor like Stripe.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiry"
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              id="cvc"
                              placeholder="123"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({items.length})</span>
                      <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="text-gray-900 font-medium">${(subtotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${(subtotal * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={handleBackToDetails}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Details
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Cart() {
  return (
    <ClientOnly>
      <CartContent />
    </ClientOnly>
  )
}
