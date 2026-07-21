import { prisma } from "@/lib/prisma";

export const SITE_SETTINGS_FALLBACK = {
  id: 1,
  aboutImage: "/docImage.png",
  bioParagraph:
    "With over 15 years of experience in medicine, I am committed to providing exceptional healthcare services tailored to each patient's unique needs.\n\nMy approach combines evidence-based medicine with compassionate care, ensuring that every patient receives the attention and treatment they deserve.",
  stat1Value: "15+ Years",
  stat2Value: "10,000+",
  contactPhone: "+1 (555) 123-4567",
  contactEmail: "contact@doctorportfolio.com",
  addressStreet: "123 Medical Plaza, Suite 400",
  addressLocality: "San Francisco",
  addressRegion: "CA",
  addressPostal: "94102",
  mondayHours: "8:00 AM - 6:00 PM",
  tuesdayHours: "8:00 AM - 6:00 PM",
  wednesdayHours: "8:00 AM - 6:00 PM",
  thursdayHours: "8:00 AM - 6:00 PM",
  fridayHours: "8:00 AM - 6:00 PM",
  saturdayHours: "9:00 AM - 2:00 PM",
  sundayHours: "Closed",
};

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  if (!settings) {
    return SITE_SETTINGS_FALLBACK;
  }

  return settings;
}
