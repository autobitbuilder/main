"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowUp, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample crypto data
const cryptoData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 67432.51,
    change24h: 2.34,
    marketCap: 1324567890000,
    volume24h: 28765432100,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3521.78,
    change24h: -1.25,
    marketCap: 423456789000,
    volume24h: 15432678900,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 172.45,
    change24h: 5.67,
    marketCap: 76543210000,
    volume24h: 5678901234,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    change24h: -0.78,
    marketCap: 15678901234,
    volume24h: 1234567890,
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: 567.89,
    change24h: 3.21,
    marketCap: 87654321000,
    volume24h: 4321098765,
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    price: 0.56,
    change24h: 1.23,
    marketCap: 28765432100,
    volume24h: 2109876543,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: 6.78,
    change24h: -2.34,
    marketCap: 7654321098,
    volume24h: 876543210,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.12,
    change24h: 4.56,
    marketCap: 15432109876,
    volume24h: 3210987654,
  },
]

export default function CryptoPriceList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h1>

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
        <Button variant="outline" className="whitespace-nowrap">
          Refresh Prices
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-4">
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
                      {filteredCryptos.map((crypto, index) => (
                        <tr key={crypto.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={`/placeholder.svg?height=32&width=32&text=${crypto.symbol}`}
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
                      ))}
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
                          <th className="text-left p-4 font-medium text-muted-foreground">#</th>
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
                          .map((crypto, index) => (
                            <tr key={crypto.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">{index + 1}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                                    <Image
                                      src={`/placeholder.svg?height=32&width=32&text=${crypto.symbol}`}
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
        <p>
          Data shown is for demonstration purposes only. In a real application, this would connect to a cryptocurrency
          API for real-time data.
        </p>
        <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
