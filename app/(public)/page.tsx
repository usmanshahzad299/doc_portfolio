import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SpecializationsSection } from "@/components/sections/specializations-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { AppointmentSection } from "@/components/sections/appointment-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionTransition } from "@/components/ui/section-transition";
import {
  absoluteUrl,
  BUSINESS_DETAILS,
  DEFAULT_OG_IMAGE,
} from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compassionate Family Medicine and Preventive Care",
  description:
    "Book appointments with Dr. Portfolio for preventive care, chronic condition management, and patient-first treatment in San Francisco.",
  keywords: [
    "family doctor San Francisco",
    "medical clinic San Francisco",
    "preventive care",
    "book medical appointment",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Compassionate Family Medicine and Preventive Care",
    description:
      "Personalized healthcare from routine checkups to chronic care management in San Francisco.",
    url: "/",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dr. Portfolio clinic and care team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compassionate Family Medicine and Preventive Care",
    description:
      "Personalized healthcare from routine checkups to chronic care management in San Francisco.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Home() {
  const medicalClinicJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: BUSINESS_DETAILS.name,
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_DETAILS.address,
    },
    telephone: BUSINESS_DETAILS.phone,
    openingHours: BUSINESS_DETAILS.openingHours,
    areaServed: BUSINESS_DETAILS.areaServed,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    sameAs: BUSINESS_DETAILS.sameAs,
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalClinicJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutSection />
      <SectionTransition />
      <HeroSection />
      <SectionTransition />
      <SpecializationsSection />
      <SectionTransition />
      <ServicesSection />
      <SectionTransition />
      <AppointmentSection />
      <SectionTransition />
      <TestimonialsSection />
      <SectionTransition />
      {/* <ContactSection /> */}
    </div>
  );
}
