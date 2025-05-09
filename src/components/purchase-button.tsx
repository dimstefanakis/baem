"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { checkout } from "@/app/actions/checkout"
import { track } from "@vercel/analytics/react"

interface PurchaseButtonProps {
  productId: string
  purchaseType: 'single' | 'multiple'
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function PurchaseButton({ productId, purchaseType, children, className, disabled }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handlePurchase() {
    try {
      setLoading(true)
      track("purchase_button_clicked", {
        productId,
        purchaseType,
      })
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
      if (!user) {
        return
      }
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
      disabled={loading || disabled}
      className={className}
    >
      {loading ? 'Processing...' : children}
    </Button>
  )
} 