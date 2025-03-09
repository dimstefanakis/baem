"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "./ui/button"

export default function ScrollButton() {
  const scrollToGallery = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const gallerySection = document.getElementById('gallery-section')
    gallerySection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      variant={null}
      size="icon"
      className="transform animate-bounce mt-10 p-12"
      onClick={scrollToGallery}
    >
      <ChevronDown style={{ width: "40px", height: "40px" }} />
    </Button>
  )
} 