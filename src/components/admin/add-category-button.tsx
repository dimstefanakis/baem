"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"

export function AddCategoryButton() {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const supabase = createClient()
      
      // Create category first to get the ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: formData.get('name') as string,
          slug: (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
          image_url: '', // Temporary, will update after upload
        })
        .select()
        .single()

      if (categoryError) throw categoryError

      // Handle image upload
      const image = formData.get('image') as File
      if (image) {
        const fileExt = image.name.split('.').pop()
        const { data: imageData, error: imageError } = await supabase.storage
          .from('categories')
          .upload(`${category.id}/${image.name}`, image)

        if (imageError) throw imageError

        // Update category with image URL
        await supabase
          .from('categories')
          .update({ 
            image_url: imageData.path
          })
          .eq('id', category.id)
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating category:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Creating...' : 'Create Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 