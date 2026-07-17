"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type SectionTransitionProps = {
  className?: string
}

export function SectionTransition({ className }: SectionTransitionProps) {
  return (
    <div className={cn("relative h-16 overflow-hidden", className)}>
      <motion.div
        initial={{ opacity: 0, scaleX: 0.85 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-x-0 top-1/2 mx-auto h-px w-[85%] -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400"
      />
    </div>
  )
}
