import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { useConfig } from "@/contexts/config-context"

const Footer = () => {
  const { config } = useConfig()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              {config?.logo ? (
                <Image
                  src={config.logo || "/placeholder.svg"}
                  alt={config?.name || "Restaurant"}
                  width={150}
                  height={50}
                  className="h-12 w-auto object-contain invert"
                />
              ) : (
                <span className="text-2xl font-bold text-white">{config?.name || "Restaurant"}</span>
              )}
            </Link>
            <p className="text-gray-400 mb-4 max-w-xs">
              {config?.description || "A delightful dining experience with the finest cuisine."}
            </p>
            <div className="flex space-x-4">
              {config?.socialMedia?.facebook && (
                <a
                  href={config.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {config?.socialMedia?.instagram && (
                <a
                  href={config.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {config?.socialMedia?.twitter && (
                <a
                  href={config.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="text-gray-400 hover:text-white transition-colors">
                  Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">{config?.address || "123 Main St, City, State, ZIP"}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a
                  href={`tel:${config?.phone || "(555) 123-4567"}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {config?.phone || "(555) 123-4567"}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a
                  href={`mailto:${config?.email || "info@restaurant.com"}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {config?.email || "info@restaurant.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              {config?.businessHours?.map((hours) => (
                <li key={hours.day} className="text-gray-400">
                  <span className="font-medium">{hours.day}: </span>
                  {hours.isClosed ? (
                    <span>Closed</span>
                  ) : (
                    <span>
                      {hours.open} - {hours.close}
                    </span>
                  )}
                </li>
              )) || (
                <>
                  <li className="text-gray-400">
                    <span className="font-medium">Mon-Fri: </span>
                    <span>11:00 - 22:00</span>
                  </li>
                  <li className="text-gray-400">
                    <span className="font-medium">Sat-Sun: </span>
                    <span>10:00 - 23:00</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {config?.name || "Restaurant"}. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
