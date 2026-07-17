export const SITE_URL = "https://doctorportfolio.com";
export const SITE_NAME = "Dr. Portfolio";
export const SITE_DEFAULT_TITLE = "Trusted Medical Care in San Francisco";
export const SITE_TITLE_TEMPLATE = "%s | Dr. Portfolio";
export const SITE_DESCRIPTION =
  "Dr. Portfolio provides compassionate, evidence-based healthcare services, preventive care, and convenient appointment scheduling in San Francisco.";

export const DEFAULT_OG_IMAGE = "/opengraph-image";
export const BLOG_OG_FALLBACK_IMAGE = "/blog/opengraph-image";

export const BUSINESS_DETAILS = {
  name: "Dr. Portfolio Medical Clinic",
  phone: "+1 (555) 123-4567",
  email: "contact@doctorportfolio.com",
  address: {
    streetAddress: "123 Medical Plaza, Suite 400",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94102",
    addressCountry: "US",
  },
  openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-14:00"],
  areaServed: "San Francisco Bay Area",
  sameAs: [
    "https://www.facebook.com/doctorportfolio",
    "https://www.instagram.com/doctorportfolio",
    "https://www.linkedin.com/company/doctorportfolio",
  ],
} as const;

export const absoluteUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, SITE_URL).toString();
};
