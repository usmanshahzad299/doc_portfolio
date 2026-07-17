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
