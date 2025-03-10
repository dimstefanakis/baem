"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Upload, Pencil, Trash } from "lucide-react"
import Image from "next/image"
import type { Database } from "@/types_db"
import { v4 as uuidv4 } from 'uuid'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export function ProductCard({ product: initialProduct }: { product: Product }) {
  const [product, setProduct] = useState(initialProduct)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(product.category_id)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const image = supabase.storage
    .from("product-images")
    .getPublicUrl(product.primary_image_url ?? "");

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

  async function refreshProduct() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', product.id)
      .single()
    
    if (data) {
      setProduct(data)
    }
  }

  async function updatePrimaryImage(files: FileList | null) {
    if (!files?.length) return

    setUploading(true)
    try {
      const fileExt = files[0].name.split('.').pop()
      const newFileName = `${product.id}/${uuidv4()}.${fileExt}`

      // Upload the new file with UUID filename
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(newFileName, files[0], {
          upsert: false // Changed to false since we're using unique names
        })

      if (error) throw error

      await supabase
        .from('products')
        .update({
          primary_image_url: data.path
        })
        .eq('id', product.id)

      await refreshProduct()
    } catch (error) {
      console.error('Error updating primary image:', error)
    } finally {
      setUploading(false)
    }
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return

    setUploading(true)
    try {
      const imagePromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const newFileName = `${product.id}/${uuidv4()}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(newFileName, file, {
            upsert: false // Changed to false since we're using unique names
          })
        
        if (error) throw error
        return data.path
      })

      const imagePaths = await Promise.all(imagePromises)
      
      const { data: currentProduct } = await supabase
        .from('products')
        .select('additional_image_urls')
        .eq('id', product.id)
        .single()
      
      const existingPaths = currentProduct?.additional_image_urls || []
      
      await supabase
        .from('products')
        .update({
          additional_image_urls: [...existingPaths, ...imagePaths]
        })
        .eq('id', product.id)

      await refreshProduct()
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
        .upload(`${product.id}/design.jpg`, files[0])

      if (error) throw error
    } catch (error) {
      console.error('Error uploading design assets:', error)
    } finally {
      setUploading(false)
    }
  }

  async function deleteAdditionalImage(imagePath: string) {
    try {
      await supabase.storage
        .from('product-images')
        .remove([imagePath])

      const { data: currentProduct } = await supabase
        .from('products')
        .select('additional_image_urls')
        .eq('id', product.id)
        .single()

      const updatedPaths = (currentProduct?.additional_image_urls || [])
        .filter(path => path !== imagePath)

      await supabase
        .from('products')
        .update({
          additional_image_urls: updatedPaths
        })
        .eq('id', product.id)

      await refreshProduct()
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  async function updateCategory(categoryId: string) {
    try {
      await supabase
        .from('products')
        .update({
          category_id: categoryId
        })
        .eq('id', product.id)

      await refreshProduct()
      setSelectedCategory(categoryId)
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="aspect-square relative">
        <Image
          src={image.data.publicUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
          onClick={() => document.getElementById(`primary-${product.id}`)?.click()}
          disabled={uploading}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {uploading ? 'Updating...' : 'Update Primary'}
        </Button>
        <input
          id={`primary-${product.id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => updatePrimaryImage(e.target.files)}
        />
      </div>
      
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-2">
        <Label htmlFor={`category-${product.id}`}>Category</Label>
        <Select
          value={selectedCategory || ''}
          onValueChange={updateCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category">
              {categories.find(c => c.id === selectedCategory)?.name}
            </SelectValue>
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

      {/* Additional Images Gallery */}
      {product.additional_image_urls && product.additional_image_urls.length > 0 && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {product.additional_image_urls.map((path, index) => {
              const additionalImage = supabase.storage
                .from("product-images")
                .getPublicUrl(path);
              
              return (
                <div key={index} className="relative flex-shrink-0 w-24 h-24">
                  <Image
                    src={additionalImage.data.publicUrl}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => deleteAdditionalImage(path)}
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => document.getElementById(`images-${product.id}`)?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
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
            accept=".jpg, .jpeg"
            className="hidden"
            onChange={(e) => uploadDesignAssets(e.target.files)}
          />
        </div>
      </div>
    </Card>
  )
} 