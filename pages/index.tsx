"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Clock, MapPin, Phone } from "lucide-react"
import { useConfig } from "@/contexts/config-context"
import LoadingSpinner from "@/components/ui/loading-spinner"
import ClientOnly from "@/components/client-only"
import { db } from "@/lib/firebase"
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore"
import { set } from "date-fns"

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
}

type Testimonial = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

// Fallback data
const fallbackFeaturedItems: MenuItem[] = [
  {
    id: "1",
    name: "Signature Pasta",
    description: "Homemade pasta with our special sauce and fresh herbs",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=400",
    category: "Main Course",
    featured: true,
  },
  {
    id: "2",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with lemon butter sauce and seasonal vegetables",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=400",
    category: "Main Course",
    featured: true,
  },
  {
    id: "3",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=400",
    category: "Dessert",
    featured: true,
  },
  {
    id: "4",
    name: "Artisan Cheese Platter",
    description: "Selection of fine cheeses with crackers, fruits, and honey",
    price: 16.99,
    image: "/placeholder.svg?height=300&width=400",
    category: "Appetizer",
    featured: true,
  },
]

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Smith",
    rating: 5,
    comment: "Absolutely amazing food and service! The atmosphere was perfect for our anniversary dinner.",
    date: "2023-04-15",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    rating: 4,
    comment: "Great food and friendly staff. The pasta was delicious and the wine selection is excellent.",
    date: "2023-05-22",
  },
  {
    id: "3",
    name: "Michael Brown",
    rating: 5,
    comment: "Best restaurant in town! We come here every month and are never disappointed.",
    date: "2023-06-10",
  },
]

type Category = {
  id: string
  name: string
  description?: string
  order: number
}

function HomePage() {
  const { config } = useConfig()
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [story, setStory] = useState<string>("")
  const [loading, setLoading] = useState(true)


//   async function addUserProfile() {
//   try {
//     const profileDocRef = doc(db, 'Resturant', "1");
//     await setDoc(profileDocRef, {
//       menu:fallbackFeaturedItems,
//       name: "fast food resturant",
//       categories: fallbackCategories,
//       Testimonials: fallbackTestimonials,
//       Config: defaultConfig
//     });
//     console.log('Profile set for user ID: ');
//   } catch (error) {
//     console.error('Error adding user profile: ', error);
//   }
// }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const menuRef = doc(db, "Resturant/1");
        const menuSnapshot = await getDoc(menuRef);
        if (menuSnapshot.exists()) {
          setFeaturedItems(menuSnapshot.data().menu);
          setTestimonials(menuSnapshot.data().Testimonials);
          setStory(menuSnapshot.data().story);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Restaurant hero image"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{config?.name || "Welcome to Our Restaurant"}</h1>
            <p className="text-xl md:text-2xl mb-8">
              {config?.description || "Experience the finest cuisine with a touch of elegance"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                View Menu
              </Link>
              <Link
                href="/reservations"
                className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Featured Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our chef's selection of signature dishes, prepared with the finest ingredients and culinary
              expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  <Link
                    href={`/menu/${item.id}`}
                    className="text-primary font-medium flex items-center text-sm hover:underline"
                  >
                    Order Now <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-6">
                {story}
              </p>
              <Link
                href="/about"
                className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our valued customers have to say about their dining
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-semibold">{testimonial.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-2">"{testimonial.comment}"</p>
                <p className="text-gray-400 text-sm">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Clock className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
              <ul className="space-y-1">
                {config?.businessHours?.slice(0, 3).map((hours) => (
                  <li key={hours.day} className="text-gray-600">
                    <span className="font-medium">{hours.day}: </span>
                    {hours.isClosed ? (
                      <span>Closed</span>
                    ) : (
                      <span>
                        {hours.open} - {hours.close}
                      </span>
                    )}
                  </li>
                ))
              }
              </ul>
              <Link
                href="/about#hours"
                className="mt-4 text-primary font-medium text-sm inline-flex items-center hover:underline"
              >
                View All Hours <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600 mb-4">{config?.address || "123 Main St, City, State, ZIP"}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(config?.address || "123 Main St")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium text-sm inline-flex items-center hover:underline"
              >
                Get Directions <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Phone className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Reservations</h3>
              <p className="text-gray-600 mb-4">Book a table online or call us directly</p>
              <a href={`tel:${config?.phone || "(555) 123-4567"}`} className="block text-gray-600 mb-2">
                {config?.phone || "(555) 123-4567"}
              </a>
              <Link
                href="/reservations"
                className="text-primary font-medium text-sm inline-flex items-center hover:underline"
              >
                Book Online <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Cuisine?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join us for an unforgettable dining experience. Book your table now or order online for delivery or takeout.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/reservations"
              className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Book a Table
            </Link>
            <Link
              href="/menu"
              className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Home() {
  return (
    <ClientOnly>
      <HomePage />
    </ClientOnly>
  )
}
