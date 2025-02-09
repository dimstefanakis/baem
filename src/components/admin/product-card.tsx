"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Upload, Pencil, Trash } from "lucide-react"
import Image from "next/image"
import type { Database } from "@/types_db"

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return

    setUploading(true)
    try {
      // Upload images
      const imagePromises = Array.from(files).map(async (file) => {
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(`${product.id}/${file.name}`, file)
        
        if (error) throw error
        return data.path
      })

      const imagePaths = await Promise.all(imagePromises)
      
      // Update product with new image URLs
      await supabase
        .from('products')
        .update({
          additional_image_urls: imagePaths.map(path => 
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`
          )
        })
        .eq('id', product.id)

    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  async function uploadDesignAssets(files: FileList | null) {
    if (!files?.length) return

    setUploading(true)
    try {
      const { data, error } = await supabase.storage
        .from('purchased-designs')
        .upload(`${product.id}/design.zip`, files[0])

      if (error) throw error
    } catch (error) {
      console.error('Error uploading design assets:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="aspect-square relative">
        <Image
          src={product.primary_image_url}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => document.getElementById(`images-${product.id}`)?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
          <input
            id={`images-${product.id}`}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => document.getElementById(`assets-${product.id}`)?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Design Assets
          </Button>
          <input
            id={`assets-${product.id}`}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => uploadDesignAssets(e.target.files)}
          />
        </div>
      </div>
    </Card>
  )
} 