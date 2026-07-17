"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = height > 0 ? (window.scrollY / height) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
