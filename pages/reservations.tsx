"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/router"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { useConfig } from "@/contexts/config-context"
import LoadingSpinner from "@/components/ui/loading-spinner"

type FormData = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  specialRequests: string
}

export default function Reservations() {
  const router = useRouter()
  const { config } = useConfig()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number.parseInt(value) : value,
    }))

    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.time) {
      newErrors.time = "Time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Add reservation to Firestore
      await addDoc(collection(db, "reservations"), {
        ...formData,
        userId: null,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      setSuccess(true)

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        specialRequests: "",
      })

      // Redirect after a delay
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("Error submitting reservation:", error)
      alert("There was an error submitting your reservation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = []
    const today = new Date().toISOString().split("T")[0]
    const isToday = formData.date === today
    const currentHour = new Date().getHours()

    // Start from 11 AM (or next available hour if today)
    let startHour = 11
    if (isToday && currentHour >= startHour) {
      startHour = currentHour + 1
    }

    // End at 9 PM (21:00)
    const endHour = 21

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) continue

        const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
        const period = hour >= 12 ? "PM" : "AM"
        const minuteFormatted = minute === 0 ? "00" : minute
        const timeSlot = `${hourFormatted}:${minuteFormatted} ${period}`

        slots.push(
          <option key={`${hour}:${minute}`} value={timeSlot}>
            {timeSlot}
          </option>,
        )
      }
    }

    return slots
  }

  // Get min date (today) and max date (6 months from now)
  const today = new Date().toISOString().split("T")[0]
  const sixMonthsLater = new Date()
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
  const maxDate = sixMonthsLater.toISOString().split("T")[0]

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Make a Reservation</h1>
          <p className="text-gray-600 mb-8 text-center">
            Reserve your table online and enjoy a delightful dining experience at {config?.name || "our restaurant"}.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Reservation Submitted!</h2>
              <p className="text-green-700 mb-4">Thank you for your reservation. We'll confirm your booking shortly.</p>
              <LoadingSpinner className="mx-auto" />
              <p className="text-sm text-gray-500 mt-4">Redirecting to homepage...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Number of Guests */}
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "People"}
                      </option>
                    ))}
                    <option value={9}>9+ People (Large Group)</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={today}
                    max={maxDate}
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.date ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={!formData.date}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      errors.time ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                    }`}
                  >
                    <option value="">Select a time</option>
                    {formData.date && generateTimeSlots()}
                  </select>
                  {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                  {!formData.date && <p className="mt-1 text-sm text-gray-500">Please select a date first</p>}
                </div>
              </div>

              {/* Special Requests */}
              <div className="mt-6">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Allergies, special occasions, seating preferences, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Book Table"
                  )}
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-500 text-center">
                * Required fields. By making a reservation, you agree to our reservation policy.
              </p>
            </form>
          )}

          {/* Reservation Policy */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Reservation Policy</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Reservations are held for 15 minutes past the scheduled time.</li>
              <li>• For parties of 6 or more, a credit card may be required to secure your reservation.</li>
              <li>• Cancellations should be made at least 24 hours in advance.</li>
              <li>
                • For special events or large groups, please contact us directly at {config?.phone || "(555) 123-4567"}.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
