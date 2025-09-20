export interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  image: string
}

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

// In-memory cache to reduce API calls
let cachedData: CryptoData[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchCryptocurrencies(limit = 50): Promise<CryptoData[]> {
  // Check if we have cached data that's still fresh
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached cryptocurrency data")
    return cachedData
  }

  // For demo purposes, return fallback data immediately to avoid rate limits
  // In production, you would implement proper API key authentication
  console.log("Using fallback data to avoid rate limits")
  const fallbackData = getFallbackData()

  // Simulate some price variation for demo
  const simulatedData = fallbackData.map((crypto) => ({
    ...crypto,
    price: crypto.price * (0.95 + Math.random() * 0.1), // ±5% variation
    change24h: crypto.change24h + (Math.random() - 0.5) * 2, // ±1% variation
  }))

  // Update cache with simulated data
  cachedData = simulatedData
  lastFetchTime = now

  return simulatedData
}

// Enhanced fallback data with more cryptocurrencies
function getFallbackData(): CryptoData[] {
  return [
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
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3521.78,
      change24h: -1.25,
      marketCap: 423456789000,
      volume24h: 15432678900,
      image: "/placeholder.svg?height=32&width=32&text=ETH",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 172.45,
      change24h: 5.67,
      marketCap: 76543210000,
      volume24h: 5678901234,
      image: "/placeholder.svg?height=32&width=32&text=SOL",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      change24h: -0.78,
      marketCap: 15678901234,
      volume24h: 1234567890,
      image: "/placeholder.svg?height=32&width=32&text=ADA",
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "BNB",
      price: 567.89,
      change24h: 3.21,
      marketCap: 87654321000,
      volume24h: 4321098765,
      image: "/placeholder.svg?height=32&width=32&text=BNB",
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      price: 0.56,
      change24h: 1.23,
      marketCap: 28765432100,
      volume24h: 2109876543,
      image: "/placeholder.svg?height=32&width=32&text=XRP",
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 6.78,
      change24h: -2.34,
      marketCap: 7654321098,
      volume24h: 876543210,
      image: "/placeholder.svg?height=32&width=32&text=DOT",
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.12,
      change24h: 4.56,
      marketCap: 15432109876,
      volume24h: 3210987654,
      image: "/placeholder.svg?height=32&width=32&text=DOGE",
    },
    {
      id: "avalanche-2",
      name: "Avalanche",
      symbol: "AVAX",
      price: 34.56,
      change24h: -1.89,
      marketCap: 12345678901,
      volume24h: 987654321,
      image: "/placeholder.svg?height=32&width=32&text=AVAX",
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      price: 14.23,
      change24h: 2.67,
      marketCap: 8765432109,
      volume24h: 654321098,
      image: "/placeholder.svg?height=32&width=32&text=LINK",
    },
  ]
}
