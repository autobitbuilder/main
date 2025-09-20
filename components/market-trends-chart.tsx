"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CryptoData } from "@/lib/coingecko-api"

interface MarketTrendsChartProps {
  cryptoData: CryptoData[]
}

export default function MarketTrendsChart({ cryptoData }: MarketTrendsChartProps) {
  // Calculate market distribution by market cap
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0)

  const marketDistribution = cryptoData.slice(0, 5).map((crypto) => ({
    ...crypto,
    percentage: (crypto.marketCap / totalMarketCap) * 100,
  }))

  // Calculate performance ranges
  const performanceRanges = [
    { label: "Strong Gains (+5%)", min: 5, max: Number.POSITIVE_INFINITY, color: "bg-green-500" },
    { label: "Moderate Gains (+1% to +5%)", min: 1, max: 5, color: "bg-green-300" },
    { label: "Stable (-1% to +1%)", min: -1, max: 1, color: "bg-gray-300" },
    { label: "Moderate Loss (-5% to -1%)", min: -5, max: -1, color: "bg-red-300" },
    { label: "Strong Loss (<-5%)", min: Number.NEGATIVE_INFINITY, max: -5, color: "bg-red-500" },
  ]

  const performanceStats = performanceRanges.map((range) => {
    const count = cryptoData.filter((crypto) => crypto.change24h >= range.min && crypto.change24h < range.max).length
    return {
      ...range,
      count,
      percentage: (count / cryptoData.length) * 100,
    }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Market Dominance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Dominance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketDistribution.map((crypto) => (
              <div key={crypto.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{crypto.symbol}</span>
                    <span className="text-sm text-muted-foreground">{crypto.name}</span>
                  </div>
                  <span className="text-sm font-medium">{crypto.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={crypto.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">24h Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceStats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {stat.min > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : stat.max < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-300" />
                    )}
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{stat.count}</span>
                    <span className="text-xs text-muted-foreground ml-1">({stat.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 rounded-full ${stat.color}`} style={{ width: `${stat.percentage}%` }} />
                  <div className="h-2 bg-gray-100 rounded-full flex-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
