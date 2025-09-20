import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

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

interface CryptoPriceCardProps {
  crypto: CryptoData
  formatCurrency: (value: number) => string
  formatMarketCap: (value: number) => string
}

export function CryptoPriceCard({ crypto, formatCurrency, formatMarketCap }: CryptoPriceCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{crypto.symbol.toUpperCase()}</span>
            </div>
            <div>
              <h3 className="font-semibold">{crypto.name}</h3>
              <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={`${isPositive ? "bg-green-500 hover:bg-green-600" : ""} flex items-center gap-1`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(crypto.current_price)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatMarketCap(crypto.market_cap)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume 24h</p>
            <p className="font-medium">{formatMarketCap(crypto.total_volume)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">24h High</p>
            <p className="font-medium text-green-600">{formatCurrency(crypto.high_24h)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">24h Low</p>
            <p className="font-medium text-red-600">{formatCurrency(crypto.low_24h)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
