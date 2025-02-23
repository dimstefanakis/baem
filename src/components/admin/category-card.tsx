'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Pencil } from "lucide-react"
import Image from "next/image"
import type { Database } from "@/types_db"
import { v4 as uuidv4 } from 'uuid'
import { Input } from "@/components/ui/input"

type Category = Database['public']['Tables']['categories']['Row']

export function CategoryCard({ category: initialCategory }: { category: Category }) {
  const [category, setCategory] = useState(initialCategory)
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState(category.name)
  const supabase = createClient()
  const image = supabase.storage
    .from("categories")
    .getPublicUrl(category.image_url ?? "");

  async function refreshCategory() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('id', category.id)
      .single()
    
    if (data) {
      setCategory(data)
      setName(data.name)
    }
  }

  async function updateImage(files: FileList | null) {
    if (!files?.length) return

    setUploading(true)
    try {
      const fileExt = files[0].name.split('.').pop()
      const newFileName = `${category.id}/${uuidv4()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('categories')
        .upload(newFileName, files[0], {
          upsert: false
        })

      if (error) throw error

      await supabase
        .from('categories')
        .update({
          image_url: data.path
        })
        .eq('id', category.id)

      await refreshCategory()
    } catch (error) {
      console.error('Error updating image:', error)
    } finally {
      setUploading(false)
    }
  }

  async function updateName() {
    try {
      await supabase
        .from('categories')
        .update({
          name: name
        })
        .eq('id', category.id)

      await refreshCategory()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating name:', error)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="aspect-square relative">
        <Image
          src={image.data.publicUrl}
          alt={category.name}
          fill
          className="object-cover rounded"
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
          onClick={() => document.getElementById(`image-${category.id}`)?.click()}
          disabled={uploading}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {uploading ? 'Updating...' : 'Update Image'}
        </Button>
        <input
          id={`image-${category.id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => updateImage(e.target.files)}
        />
      </div>
      
      <div className="space-y-2">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={updateName}>Save</Button>
            <Button variant="outline" onClick={() => {
              setIsEditing(false)
              setName(category.name)
            }}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{category.name}</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
} 