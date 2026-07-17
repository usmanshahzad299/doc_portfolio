import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import sql from "mssql";

const prisma = new PrismaClient();

async function main() {
  const pool = await sql.connect({
    server: "localhost",
    port: 1433,
    database: "dr_portfolio",
    user: "dr_admin",
    password: "admin123",
    options: {
      trustServerCertificate: true,
      encrypt: true,
    },
  });

  console.log("Connected to SQL Server.");

  try {
    const users = await pool.request().query(`
      SELECT
        [id],
        [name],
        [email],
        [password],
        [role],
        [createdAt],
        [updatedAt]
      FROM [User]
      ORDER BY [createdAt] ASC
    `);

    for (const row of users.recordset) {
      await prisma.user.create({
        data: {
          id: row.id,
          name: row.name,
          email: row.email,
          password: row.password,
          role: row.role,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
    }
    console.log(`Migrated ${users.recordset.length} users.`);

    const posts = await pool.request().query(`
      SELECT
        [id],
        [title],
        [slug],
        [excerpt],
        [content],
        [coverImage],
        [published],
        [authorId],
        [createdAt],
        [updatedAt]
      FROM [BlogPost]
      ORDER BY [createdAt] ASC
    `);

    for (const row of posts.recordset) {
      await prisma.blogPost.create({
        data: {
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          content: row.content,
          coverImage: row.coverImage,
          published: Boolean(row.published),
          authorId: row.authorId,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
    }
    console.log(`Migrated ${posts.recordset.length} blog posts.`);

    const services = await pool.request().query(`
      SELECT
        [id],
        [title],
        [description],
        [icon],
        [order],
        [published],
        [createdAt],
        [updatedAt]
      FROM [Service]
      ORDER BY [createdAt] ASC
    `);

    for (const row of services.recordset) {
      await prisma.service.create({
        data: {
          id: row.id,
          title: row.title,
          description: row.description,
          icon: row.icon,
          order: row.order,
          published: Boolean(row.published),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
    }
    console.log(`Migrated ${services.recordset.length} services.`);

    const appointments = await pool.request().query(`
      SELECT
        [id],
        [patientName],
        [gender],
        [age],
        [bookingFor],
        [email],
        [phone],
        [date],
        [time],
        [reason],
        [status],
        [notes],
        [createdAt],
        [updatedAt]
      FROM [Appointment]
      ORDER BY [createdAt] ASC
    `);

    for (const row of appointments.recordset) {
      await prisma.appointment.create({
        data: {
          id: row.id,
          patientName: row.patientName,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          age: row.age,
          bookingFor: row.bookingFor,
          date: row.date,
          time: row.time,
          reason: row.reason,
          status: row.status,
          notes: row.notes,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
    }
    console.log(`Migrated ${appointments.recordset.length} appointments.`);

    const testimonials = await pool.request().query(`
      SELECT
        [id],
        [patientName],
        [content],
        [rating],
        [published],
        [createdAt],
        [updatedAt]
      FROM [Testimonial]
      ORDER BY [createdAt] ASC
    `);

    for (const row of testimonials.recordset) {
      await prisma.testimonial.create({
        data: {
          id: row.id,
          patientName: row.patientName,
          content: row.content,
          rating: row.rating,
          published: Boolean(row.published),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      });
    }
    console.log(`Migrated ${testimonials.recordset.length} testimonials.`);

    console.log("Migration complete.");
  } finally {
    await pool.close();
  }
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
