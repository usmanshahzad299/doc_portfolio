import { prisma } from "../lib/prisma";

async function verify() {
  try {
    const userCount = await prisma.user.count();
    const blogCount = await prisma.blogPost.count();
    const appointmentCount = await prisma.appointment.count();
    
    console.log("✅ Connected to Prisma Postgres successfully!");
    console.log(`\n📊 Database Stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Blog Posts: ${blogCount}`);
    console.log(`   Appointments: ${appointmentCount}`);
    
    // Test a read operation
    const users = await prisma.user.findMany({
      select: { email: true, name: true, role: true }
    });
    
    console.log(`\n👥 Users in database:`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error("❌ Error connecting to database:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
