import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
      name: "Dr. Admin",
      role: "admin",
    },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Dr. Admin",
      role: "admin",
    },
  });

  console.log(`Created user with id: ${user.id}`);
  console.log("Email: admin@example.com");
  console.log("Password: admin123");

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
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
    },
  });

  console.log("Seeded singleton site settings.");
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
