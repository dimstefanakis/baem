"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import type { Database } from "@/types_db"

type Category = Database['public']['Tables']['categories']['Row']

export function AddProductButton() {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (data) setCategories(data)
    }
    
    fetchCategories()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      
      // Add category_id to the product creation
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          single_purchase_price: parseInt(formData.get('single_price') as string) * 100,
          multiple_purchase_price: parseInt(formData.get('multiple_price') as string) * 100,
          is_single_purchase_available: true,
          category_id: formData.get('category_id') as string,
          primary_image_url: '',
        })
        .select()
        .single()

      if (productError) throw productError

      // Handle primary image upload
      const primaryImage = (formData.get('primary_image') as File)
      if (!primaryImage) {
        throw new Error('Primary image is required')
      }

      // Upload primary image
      const { data: imageData, error: imageError } = await supabase.storage
        .from('product-images')
        .upload(`${product.id}/primary.${primaryImage.name.split('.').pop()}`, primaryImage)

      if (imageError) throw imageError

      // Image path
      const imageUrl = `${imageData.path}`
      const imageUrlPublic = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${imageData.path}`

      // Create Stripe product and prices
      const response = await fetch('/api/admin/create-stripe-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          images: [imageUrlPublic],
          singlePrice: parseInt(formData.get('single_price') as string) * 100,
          multiplePrice: parseInt(formData.get('multiple_price') as string) * 100,
          productId: product.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Stripe product')
      }

      const { stripeProductId, stripeSinglePriceId, stripleMultiplePriceId } = await response.json()

      // Update product with image URL and Stripe IDs
      await supabase
        .from('products')
        .update({ 
          primary_image_url: imageUrl,
          stripe_product_id: stripeProductId,
          stripe_single_price_id: stripeSinglePriceId,
          stripe_multiple_price_id: stripleMultiplePriceId
        })
        .eq('id', product.id)

      // Handle design assets upload
      const designAssets = formData.get('design_assets') as File
      if (designAssets) {
        await supabase.storage
          .from('purchased-designs')
          .upload(`${product.id}/design.jpg`, designAssets)
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="primary_image">Primary Image</Label>
            <div className="flex gap-2">
              <Input
                id="primary_image"
                name="primary_image"
                type="file"
                accept="image/*"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="design_assets">Design Assets (JPG or PNG)</Label>
            <div className="flex gap-2">
              <Input
                id="design_assets"
                name="design_assets"
                type="file"
                accept=".jpg, .jpeg, .png"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="single_price">Single Purchase Price ($)</Label>
            <Input id="single_price" name="single_price" type="number" required />
          </div>
          <div>
            <Label htmlFor="multiple_price">Multiple Purchase Price ($)</Label>
            <Input id="multiple_price" name="multiple_price" type="number" required />
          </div>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 