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
      let { data: { user } } = await supabase.auth.getUser()
      
      // If no user, try anonymous sign in
      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          console.error('Anonymous sign in error:', error)
          // router.push('/login')
          return
        }
        user = data.user
      }

      // Use the server action with the user ID
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