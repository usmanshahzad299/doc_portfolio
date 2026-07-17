"use client"

import { useEffect, useRef, useState } from "react"

type StatCounterProps = {
  target: number
  suffix?: string
  durationMs?: number
  className?: string
}

export function StatCounter({
  target,
  suffix = "",
  durationMs = 1200,
  className = "",
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs, hasStarted, target])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
