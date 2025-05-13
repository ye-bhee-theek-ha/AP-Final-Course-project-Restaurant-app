"use client"

import type React from "react"
import Head from "next/head"
import Header from "./header"
import Footer from "./footer"
import { useConfig } from "@/contexts/config-context"
import LoadingSpinner from "../ui/loading-spinner"

type LayoutProps = {
  children: React.ReactNode
  title?: string
  description?: string
}

const Layout = ({
  children,
  title = "Restaurant Website",
  description = "Welcome to our restaurant website",
}: LayoutProps) => {
  const { config, loading } = useConfig()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {title} | {config?.name || "Restaurant"}
        </title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Apply custom font and colors from config */}
        <style jsx global>{`
          :root {
            --primary-color: ${config?.primaryColor || "#4f46e5"};
            --secondary-color: ${config?.secondaryColor || "#f97316"};
            --font-family: ${config?.fontFamily || "Poppins, sans-serif"};
          }
        `}</style>
      </Head>

      <div className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
