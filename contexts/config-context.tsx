"use client"

import { db } from "@/lib/firebase"
import { set } from "date-fns"
import { doc, getDoc } from "firebase/firestore"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type BusinessHours = {
  day: string
  open: string
  close: string
  isClosed: boolean
}

type RestaurantConfig = {
  name: string
  logo: string
  description: string
  address: string
  phone: string
  email: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  businessHours: BusinessHours[]
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  specialOffers: {
    id: string
    title: string
    description: string
    image?: string
    validUntil?: string
  }[]
}

type ConfigContextType = {
  config: RestaurantConfig | null
  loading: boolean
  error: string | null
  refreshConfig: () => Promise<void>
}


const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RestaurantConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
      setLoading(true)
      try {
        const menuRef = doc(db, "Resturant/1");
        const menuSnapshot = await getDoc(menuRef);
        if (menuSnapshot.exists()) {
          setConfig(menuSnapshot.data().Config)
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data: ", error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchData()
  }, [])

  const value = {
    config,
    loading,
    error,
    refreshConfig: fetchData,
  }

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}
