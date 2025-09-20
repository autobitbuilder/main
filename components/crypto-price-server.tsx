import { fetchCryptocurrencies } from "@/lib/coingecko-api"
import CryptoPriceClient from "./crypto-price-client"

export default async function CryptoPriceServer() {
  try {
    const cryptoData = await fetchCryptocurrencies(50)
    return <CryptoPriceClient initialData={cryptoData} />
  } catch (error) {
    console.error("Server-side crypto fetch error:", error)
    // Return fallback data if server-side fetch fails
    const fallbackData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 67432.51,
        change24h: 2.34,
        marketCap: 1324567890000,
        volume24h: 28765432100,
        image: "/placeholder.svg?height=32&width=32&text=BTC",
      },
      // Add more fallback data as needed
    ]
    return <CryptoPriceClient initialData={fallbackData} />
  }
}
