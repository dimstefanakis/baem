"use client"

import { Card } from "@/components/ui/card"
import type { Database } from "@/types_db"

interface ProductStatsProps {
  stat: Database['public']['Views']['product_stats']['Row']
}

export function ProductStats({ stat }: ProductStatsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{stat.name}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Sales</span>
          <span className="font-medium">${(stat.total_amount ?? 0 / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Units Sold</span>
          <span className="font-medium">{stat.purchase_count}</span>
        </div>
      </div>
    </Card>
  )
} 