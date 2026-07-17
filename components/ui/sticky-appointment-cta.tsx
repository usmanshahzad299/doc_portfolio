"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyAppointmentCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/appointments")) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300   ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full  blur-sm animate-pulse px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg"
      />
      <Link
        href="/#appointments"
        className="inline-flex items-center gap-2 rounded-full border bg-blue-600 text-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg backdrop-blur hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-600"
      >
        Book Appointment
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
