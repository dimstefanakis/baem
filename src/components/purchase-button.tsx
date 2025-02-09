"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { checkout } from "@/app/actions/checkout"

interface PurchaseButtonProps {
  productId: string
  purchaseType: 'single' | 'multiple'
  children: React.ReactNode
  className?: string
}

export function PurchaseButton({ productId, purchaseType, children, className }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handlePurchase() {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Use the server action
      await checkout(productId, purchaseType, user.id)
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handlePurchase} 
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : children}
    </Button>
  )
} 