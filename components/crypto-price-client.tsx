"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, Search, Star, RefreshCw } from "lucide-react"
import MarketOverview from "./market-overview"
import MarketTrendsChart from "./market-trends-chart"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { CryptoData } from "@/lib/coingecko-api"

interface CryptoPriceClientProps {
  initialData: CryptoData[]
}

export default function CryptoPriceClient({ initialData }: CryptoPriceClientProps) {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { toast } = useToast()

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("crypto-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("crypto-favorites", JSON.stringify(favorites))
  }, [favorites])

  const filteredCryptos = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const refreshPrices = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/crypto-prices")

      if (response.status === 429) {
        const errorData = await response.json()
        toast({
          title: "Rate Limited",
          description: `Please wait ${errorData.retryAfter || 30} seconds before refreshing again.`,
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch prices")
      }

      const newData = await response.json()
      setCryptoData(newData)
      setLastUpdated(new Date())
      toast({
        title: "Prices Updated",
        description: "Cryptocurrency prices have been refreshed successfully.",
      })
    } catch (error) {
      console.error("Error refreshing prices:", error)
      toast({
        title: "Update Failed",
        description: "Failed to refresh prices. Using cached data if available.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`
    if (price < 10) return `$${price.toFixed(3)}`
    if (price < 1000) return `$${price.toFixed(2)}`
    return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Cryptocurrency Prices</h1>
        <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cryptocurrencies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="whitespace-nowrap bg-transparent"
          onClick={refreshPrices}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Prices"}
        </Button>
      </div>

      <MarketOverview cryptoData={cryptoData} />
      <MarketTrendsChart cryptoData={cryptoData} />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Cryptocurrencies ({filteredCryptos.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CryptoTable
            cryptos={filteredCryptos}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            formatPrice={formatPrice}
            formatNumber={formatNumber}
          />
        </TabsContent>
        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <CryptoTable
              cryptos={cryptoData.filter((crypto) => favorites.includes(crypto.id))}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              formatPrice={formatPrice}
              formatNumber={formatNumber}
            />
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-4">
                Click the star icon next to any cryptocurrency to add it to your favorites
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground text-center mt-8">
        <p>Data provided by CoinGecko API. Prices update every minute.</p>
        <p className="mt-1">
          Showing {cryptoData.length} cryptocurrencies • Last updated: {lastUpdated.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

interface CryptoTableProps {
  cryptos: CryptoData[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  formatPrice: (price: number) => string
  formatNumber: (num: number) => string
}

function CryptoTable({ cryptos, favorites, onToggleFavorite, formatPrice, formatNumber }: CryptoTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                <th className="text-right p-4 font-medium text-muted-foreground">24h %</th>
                <th className="text-right p-4 font-medium text-muted-foreground hidden md:table-cell">Market Cap</th>
                <th className="text-right p-4 font-medium text-muted-foreground hidden lg:table-cell">Volume (24h)</th>
                <th className="text-center p-4 font-medium text-muted-foreground">Favorite</th>
              </tr>
            </thead>
            <tbody>
              {cryptos.map((crypto, index) => (
                <tr key={crypto.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={crypto.image || `/placeholder.svg?height=32&width=32&text=${crypto.symbol}`}
                          alt={crypto.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">{formatPrice(crypto.price)}</td>
                  <td className="p-4 text-right">
                    <div
                      className={`flex items-center justify-end gap-1 ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {crypto.change24h >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      {Math.abs(crypto.change24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-4 text-right hidden md:table-cell">{formatNumber(crypto.marketCap)}</td>
                  <td className="p-4 text-right hidden lg:table-cell">{formatNumber(crypto.volume24h)}</td>
                  <td className="p-4 text-center">
                    <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(crypto.id)} className="h-8 w-8">
                      <Star
                        className={`h-5 w-5 ${favorites.includes(crypto.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
