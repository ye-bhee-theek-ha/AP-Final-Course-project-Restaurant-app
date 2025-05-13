import Image from "next/image"
import Link from "next/link"
import { useConfig } from "@/contexts/config-context"

export default function About() {
  const { config } = useConfig()

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About {config?.name || "Our Restaurant"}</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover our story, our passion for food, and our commitment to providing an exceptional dining experience.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=800&width=600" alt="Restaurant story" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, our restaurant began as a small family-owned establishment with a simple mission: to
              serve delicious, high-quality food made with fresh ingredients and to create a warm, welcoming atmosphere
              for our guests.
            </p>
            <p className="text-gray-600 mb-4">
              Over the years, we've grown and evolved, but our core values remain the same. We're committed to culinary
              excellence, exceptional service, and creating memorable dining experiences for every guest who walks
              through our doors.
            </p>
            <p className="text-gray-600">
              Today, we're proud to be a beloved part of the community, serving both locals and visitors alike. Our menu
              features a blend of traditional favorites and innovative new dishes, all prepared with care and attention
              to detail.
            </p>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chef */}
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image src="/placeholder.svg?height=400&width=300" alt="Head Chef" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Michael Johnson</h3>
              <p className="text-primary font-medium mb-2">Head Chef</p>
              <p className="text-gray-600 text-sm">
                With over 15 years of culinary experience, Chef Michael brings creativity and passion to every dish.
              </p>
            </div>

            {/* Manager */}
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="Restaurant Manager"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Sarah Williams</h3>
              <p className="text-primary font-medium mb-2">Restaurant Manager</p>
              <p className="text-gray-600 text-sm">
                Sarah ensures that every aspect of your dining experience exceeds expectations.
              </p>
            </div>

            {/* Sommelier */}
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image src="/placeholder.svg?height=400&width=300" alt="Sommelier" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">David Chen</h3>
              <p className="text-primary font-medium mb-2">Sommelier</p>
              <p className="text-gray-600 text-sm">
                David's expertise helps you find the perfect wine pairing for your meal.
              </p>
            </div>
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="bg-gray-50 rounded-lg p-8 mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Philosophy</h2>
            <p className="text-gray-600 mb-8">
              At {config?.name || "our restaurant"}, we believe that dining is more than just eating—it's an experience.
              Our philosophy is built on three core principles:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Quality Ingredients</h3>
                <p className="text-gray-600 text-sm">
                  We source the freshest, highest-quality ingredients from local suppliers whenever possible.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Culinary Creativity</h3>
                <p className="text-gray-600 text-sm">
                  We blend traditional techniques with innovative approaches to create unique, flavorful dishes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Exceptional Service</h3>
                <p className="text-gray-600 text-sm">
                  We're committed to providing attentive, personalized service that makes every guest feel special.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div id="hours" className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Business Hours</h2>
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white py-4 px-6">
              <h3 className="text-xl font-semibold">When We're Open</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {config?.businessHours?.map((hours) => (
                  <li key={hours.day} className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="font-medium">{hours.day}</span>
                    {hours.isClosed ? (
                      <span className="text-red-500">Closed</span>
                    ) : (
                      <span>
                        {hours.open} - {hours.close}
                      </span>
                    )}
                  </li>
                )) || (
                  <>
                    <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium">Monday - Thursday</span>
                      <span>11:00 AM - 10:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium">Friday - Saturday</span>
                      <span>11:00 AM - 11:00 PM</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="font-medium">Sunday</span>
                      <span>10:00 AM - 9:00 PM</span>
                    </li>
                  </>
                )}
              </ul>
              <p className="mt-4 text-sm text-gray-500">* Kitchen closes 30 minutes before closing time.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Come Dine With Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We'd love to welcome you to {config?.name || "our restaurant"} and share our passion for great food and
            hospitality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/reservations"
              className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Make a Reservation
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
