"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
}

export function AnimatedNumber({
  value,
  duration = 1500,
}: AnimatedNumberProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Extract numeric part (e.g., "15+" -> 15, "10,000+" -> 10000)
  const rawString = String(value || "");
  const numericTarget =
    parseInt(rawString.replace(/,/g, "").replace(/\D/g, ""), 10) || 0;

  // Extract non-numeric suffix (e.g., "+", "%", " Years")
  const suffix = rawString.replace(/[0-9,]/g, "").trim();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation only when element becomes visible in screen viewport
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }, // Triggers when 30% of the element is visible
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasAnimated]);

  useEffect(() => {
    // Only run animation after viewport trigger
    if (!hasAnimated || !numericTarget) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Smooth ease-out quad curve
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutQuad * numericTarget);

      setDisplayCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasAnimated, numericTarget, duration]);

  if (!value) return null;

  return (
    <span ref={elementRef}>
      {displayCount.toLocaleString()}
      {suffix ? ` ${suffix}` : ""}
    </span>
  );
}
