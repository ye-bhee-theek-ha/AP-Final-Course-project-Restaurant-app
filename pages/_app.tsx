import type { AppProps } from "next/app"
import { CartProvider } from "@/contexts/cart-context"
import { ConfigProvider } from "@/contexts/config-context"
import { OrderProvider } from "@/contexts/order-context"
import Layout from "@/components/layout/layout"
import ErrorBoundary from "@/components/error-boundary"
import ClientOnly from "@/components/client-only"
import "@/styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <ConfigProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </OrderProvider>
          </CartProvider>
        </ConfigProvider>
      </ClientOnly>
    </ErrorBoundary>
  )
}

export default MyApp
