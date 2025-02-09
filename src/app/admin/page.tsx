import { createClient } from "@/lib/supabase-server"
import { ProductStats } from "@/components/admin/product-stats"
import { AddProductButton } from "@/components/admin/add-product-button"

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: stats } = await supabase
    .from('product_stats')
    .select('*')

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddProductButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.map((stat) => (
          <ProductStats key={stat.product_id} stat={stat} />
        ))}
      </div>
    </div>
  )
} 