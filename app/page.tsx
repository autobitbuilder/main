"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { CryptoPriceCard } from "@/components/crypto-price-card"
import { PriceChart } from "@/components/price-chart"

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  high_24h: number
  low_24h: number
  last_updated: string
}

export default function CryptoPriceList() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCryptoData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,cardano,polkadot,chainlink&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h",
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setCryptoData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching crypto data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch crypto data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchCryptoData()
  }, [fetchCryptoData])

  useEffect(() => {
    fetchCryptoData()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000)

    return () => clearInterval(interval)
  }, [fetchCryptoData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    }
    return formatCurrency(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium">Loading crypto prices...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Crypto Price Tracker</h1>
            <p className="text-muted-foreground mt-1">Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
            <Button onClick={handleRefresh} disabled={refreshing} className="bg-primary hover:bg-primary/90">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-destructive rounded-full" />
                <span className="text-destructive font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bitcoin Highlight Card */}
        {cryptoData.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Bitcoin (BTC) - Featured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(cryptoData[0].current_price)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <div className="flex items-center gap-2">
                    {cryptoData[0].price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <Badge
                      variant={cryptoData[0].price_change_percentage_24h >= 0 ? "default" : "destructive"}
                      className={cryptoData[0].price_change_percentage_24h >= 0 ? "bg-green-500" : ""}
                    >
                      {cryptoData[0].price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-xl font-semibold">{formatMarketCap(cryptoData[0].market_cap)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Chart */}
        {cryptoData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Price Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart data={cryptoData} />
            </CardContent>
          </Card>
        )}

        {/* Crypto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoData.map((crypto) => (
            <CryptoPriceCard
              key={crypto.id}
              crypto={crypto}
              formatCurrency={formatCurrency}
              formatMarketCap={formatMarketCap}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
