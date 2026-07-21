"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollLink } from "../ui/scroll-link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
              DR.
            </span>
            <span className="text-2xl font-bold text-blue-600">Ali AKbar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ScrollLink
              targetId="about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </ScrollLink>
            <ScrollLink
              targetId="specializations"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Specializations
            </ScrollLink>
            <ScrollLink
              targetId="services"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </ScrollLink>
            <ScrollLink
              targetId="testimonials"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </ScrollLink>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <ScrollLink
              targetId="appointments"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </ScrollLink>
            <ScrollLink targetId="appointments">
              <Button className="rounded-full bg-blue-600 text-white px-5 hover:-translate-y-0.5 hover:bg-blue-700 cursor-pointer">
                Book Appointment
              </Button>
            </ScrollLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <ScrollLink
                targetId="about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </ScrollLink>
              <ScrollLink
                targetId="specializations"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Specializations
              </ScrollLink>
              <ScrollLink
                targetId="services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </ScrollLink>
              <ScrollLink
                targetId="testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </ScrollLink>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <ScrollLink
                targetId="appointments"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </ScrollLink>

              <ScrollLink
                targetId="appointments"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book Appointment
                </Button>
              </ScrollLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
