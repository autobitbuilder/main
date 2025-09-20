export interface CoinGeckoResponse {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null
  last_updated: string
}

export interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  image: string
  rank: number
}

export async function fetchCryptoPrices(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CoinGeckoResponse[] = await response.json()

    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      image: coin.image,
      rank: coin.market_cap_rank,
    }))
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    throw error
  }
}

export async function searchCryptocurrencies(query: string): Promise<any[]> {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.coins || []
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error)
    return []
  }
}
