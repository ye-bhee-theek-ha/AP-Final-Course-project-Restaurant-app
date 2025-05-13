"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  options?: {
    name: string
    choices: {
      name: string
      price?: number
    }[]
  }[]
  allergens?: string[]
  dietary?: string[]
}

type Category = {
  id: string
  name: string
  description?: string
  order: number
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

    useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const menuRef = doc(db, "Resturant/1");
        const menuSnapshot = await getDoc(menuRef);
        if (menuSnapshot.exists()) {
          setCategories(menuSnapshot.data().categories);
          setMenuItems(menuSnapshot.data().menu);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
  }

  const filteredItems =
    activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Menu Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully crafted menu featuring the finest ingredients and culinary traditions. From appetizers
            to desserts, there's something for everyone to enjoy.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                {/* Dietary and Allergen Info */}
                {((item.dietary && item.dietary.length > 0) || (item.allergens && item.allergens.length > 0)) && (
                  <div className="mb-4">
                    {/* Dietary Information Section */}
                    {item.dietary && item.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {item.dietary.map((diet) => (
                          <span key={diet} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {diet}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Allergens Information Section */}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen) => (
                          <span key={allergen} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}


                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <Link
                    href={`/menu/${item.id}`}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
