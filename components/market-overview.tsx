"use client"

import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CryptoData } from "@/lib/coingecko-api"

interface MarketOverviewProps {
  cryptoData: CryptoData[]
}

export default function MarketOverview({ cryptoData }: MarketOverviewProps) {
  // Calculate market statistics
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0)
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0)
  const gainers = cryptoData.filter((crypto) => crypto.change24h > 0).length
  const losers = cryptoData.filter((crypto) => crypto.change24h < 0).length
  const avgChange = cryptoData.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptoData.length

  // Get top gainers and losers
  const topGainers = [...cryptoData].sort((a, b) => b.change24h - a.change24h).slice(0, 3)

  const topLosers = [...cryptoData].sort((a, b) => a.change24h - b.change24h).slice(0, 3)

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Market Cap */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalMarketCap)}</div>
          <p className="text-xs text-muted-foreground">Across {cryptoData.length} cryptocurrencies</p>
        </CardContent>
      </Card>

      {/* 24h Volume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalVolume)}</div>
          <p className="text-xs text-muted-foreground">Total trading volume</p>
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
          {avgChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${avgChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {avgChange >= 0 ? "+" : ""}
            {avgChange.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">Average 24h change</p>
        </CardContent>
      </Card>

      {/* Gainers vs Losers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gainers vs Losers</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-green-500">
              {gainers} ↑
            </Badge>
            <Badge variant="secondary" className="text-red-500">
              {losers} ↓
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">24h performance split</p>
        </CardContent>
      </Card>

      {/* Top Gainers */}
      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Top Gainers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topGainers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className="text-xs text-muted-foreground">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-500">+{crypto.change24h.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground">${crypto.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Top Losers (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLosers.map((crypto, index) => (
              <div key={crypto.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className="text-xs text-muted-foreground">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-500">{crypto.change24h.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground">${crypto.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
