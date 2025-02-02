"use client"
import { motion } from "motion/react";

export default function ShopNowButton() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg mb-8 
                     shadow-lg hover:shadow-xl transition-shadow duration-300
                     border-2 border-black/10"
    >
      Shop Now
    </motion.button>
  )
}