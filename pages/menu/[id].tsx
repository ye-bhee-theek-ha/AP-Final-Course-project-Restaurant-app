"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useCart } from "@/contexts/cart-context"
import LoadingSpinner from "@/components/ui/loading-spinner"

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
  relatedItems?: string[]
}

export default function MenuItemDetail() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<MenuItem | null>(null)
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const { addItem } = useCart()

  console.log(id)


  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!id) return

      try {
        setLoading(true)
        const docRef = doc(db, "Resturant/1")

        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const menus = docSnap.data().menu
          console.log(menus)
          const menuItem = menus.find((item: MenuItem) => item.id === id)
          if (menuItem) {
            setItem(menuItem)
          }

          // Initialize selected options
          if (menuItem.options) {
            const initialOptions: Record<string, string> = {}
            menuItem.options.forEach((option:any) => {
              if (option.choices.length > 0) {
                initialOptions[option.name] = option.choices[0].name
              }
            })
            setSelectedOptions(initialOptions)
          }

          // Fetch related items if any
          if (menuItem.relatedItems && menuItem.relatedItems.length > 0) {
            const relatedDocs = await Promise.all(
              menuItem.relatedItems.map((relatedId:any) => getDoc(doc(db, "menu", relatedId))),
            )

            const relatedItemsData = relatedDocs
              .filter((doc) => doc.exists())
              .map((doc) => ({ id: doc.id, ...doc.data() }) as MenuItem)

            setRelatedItems(relatedItemsData)
          }
        } else {
          // Handle item not found
          router.push("/menu")
        }
      } catch (error) {
        console.error("Error fetching menu item:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItem()
  }, [id, router])



  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, Math.min(10, value)))
  }

  const handleOptionChange = (optionName: string, choiceName: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choiceName,
    }))
  }

  const calculateTotalPrice = () => {
    if (!item) return 0

    let total = item.price

    // Add option prices
    if (item.options) {
      item.options.forEach((option) => {
        const selectedChoice = option.choices.find((choice) => choice.name === selectedOptions[option.name])
        if (selectedChoice && selectedChoice.price) {
          total += selectedChoice.price
        }
      })
    }

    return total * quantity
  }

  const handleAddToCart = () => {
    if (!item) return

    addItem({
      id: item.id,
      name: item.name,
      price: calculateTotalPrice() / quantity,
      quantity,
      image: item.image,
      options: selectedOptions,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="pt-20 pb-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Link href="/menu" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Back to Menu Link */}
        <Link href="/menu" className="text-primary hover:underline inline-flex items-center mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Link>

        {/* Item Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            {item.featured && (
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-md">Featured</div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <p className="text-2xl text-primary font-bold mb-4">${item.price.toFixed(2)}</p>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{item.description}</p>

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
            </div>

            {/* Options */}
            {item.options && item.options.length > 0 && (
              <div className="mb-6 space-y-4">
                {item.options.map((option) => (
                  <div key={option.name}>
                    <h3 className="text-sm font-medium mb-2">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.choices.map((choice) => (
                        <button
                          key={choice.name}
                          onClick={() => handleOptionChange(option.name, choice.name)}
                          className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                            selectedOptions[option.name] === choice.name
                              ? "bg-primary text-white border-primary"
                              : "border-gray-300 hover:border-primary"
                          }`}
                        >
                          {choice.name}
                          {choice.price !== undefined && choice.price > 0 && (
                            <span> (+${choice.price.toFixed(2)})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-12 text-center border-y border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-1">Total</h3>
              <p className="text-2xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem) => (
                <div key={relatedItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={relatedItem.image || "/placeholder.svg"}
                      alt={relatedItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{relatedItem.name}</h3>
                      <span className="text-primary font-bold">${relatedItem.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedItem.description}</p>
                    <Link href={`/menu/${relatedItem.id}`} className="text-primary font-medium text-sm hover:underline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
