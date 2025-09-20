"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, Search, Star, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchCryptoPrices, type CryptoData } from "@/lib/coingecko"

export default function CryptoPriceList() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCryptoPrices()
      setCryptoData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cryptocurrency data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCryptoData()

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("crypto-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    // Save favorites to localStorage
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

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={loadCryptoData}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cryptocurrency Prices</h1>
        {lastUpdated && (
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        )}
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
          onClick={loadCryptoData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Prices
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-muted-foreground">Rank</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">24h %</th>
                        <th className="text-right p-4 font-medium text-muted-foreground hidden md:table-cell">
                          Market Cap
                        </th>
                        <th className="text-right p-4 font-medium text-muted-foreground hidden lg:table-cell">
                          Volume (24h)
                        </th>
                        <th className="text-center p-4 font-medium text-muted-foreground">Favorite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Loading cryptocurrency data...
                            </div>
                          </td>
                        </tr>
                      ) : filteredCryptos.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            No cryptocurrencies found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredCryptos.map((crypto) => (
                          <tr key={crypto.id} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">#{crypto.rank}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                  <Image
                                    src={crypto.image || "/placeholder.svg"}
                                    alt={crypto.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = `/placeholder.svg?height=32&width=32&text=${crypto.symbol}`
                                    }}
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
                                {crypto.change24h >= 0 ? (
                                  <ArrowUp className="h-4 w-4" />
                                ) : (
                                  <ArrowDown className="h-4 w-4" />
                                )}
                                {Math.abs(crypto.change24h).toFixed(2)}%
                              </div>
                            </td>
                            <td className="p-4 text-right hidden md:table-cell">{formatNumber(crypto.marketCap)}</td>
                            <td className="p-4 text-right hidden lg:table-cell">{formatNumber(crypto.volume24h)}</td>
                            <td className="p-4 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleFavorite(crypto.id)}
                                className="h-8 w-8"
                              >
                                <Star
                                  className={`h-5 w-5 ${favorites.includes(crypto.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="favorites">
          <div className="grid grid-cols-1 gap-4">
            {favorites.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium text-muted-foreground">Rank</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                          <th className="text-right p-4 font-medium text-muted-foreground">24h %</th>
                          <th className="text-right p-4 font-medium text-muted-foreground hidden md:table-cell">
                            Market Cap
                          </th>
                          <th className="text-right p-4 font-medium text-muted-foreground hidden lg:table-cell">
                            Volume (24h)
                          </th>
                          <th className="text-center p-4 font-medium text-muted-foreground">Favorite</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cryptoData
                          .filter((crypto) => favorites.includes(crypto.id))
                          .map((crypto) => (
                            <tr key={crypto.id} className="border-b hover:bg-muted/50">
                              <td className="p-4 font-medium">#{crypto.rank}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                    <Image
                                      src={crypto.image || "/placeholder.svg"}
                                      alt={crypto.name}
                                      width={32}
                                      height={32}
                                      className="object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = `/placeholder.svg?height=32&width=32&text=${crypto.symbol}`
                                      }}
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
                                  {crypto.change24h >= 0 ? (
                                    <ArrowUp className="h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="h-4 w-4" />
                                  )}
                                  {Math.abs(crypto.change24h).toFixed(2)}%
                                </div>
                              </td>
                              <td className="p-4 text-right hidden md:table-cell">{formatNumber(crypto.marketCap)}</td>
                              <td className="p-4 text-right hidden lg:table-cell">{formatNumber(crypto.volume24h)}</td>
                              <td className="p-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleFavorite(crypto.id)}
                                  className="h-8 w-8"
                                >
                                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the star icon next to any cryptocurrency to add it to your favorites
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground text-center mt-8">
        <p>Data provided by CoinGecko API. Prices are updated in real-time.</p>
        {lastUpdated && <p className="mt-1">Last updated: {lastUpdated.toLocaleString()}</p>}
      </div>
    </div>
  )
}
