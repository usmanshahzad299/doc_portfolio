import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Client as PgClient } from "pg";

const prisma = new PrismaClient();

async function main() {
  const oldPostgresUrl = process.env.OLD_POSTGRES_URL;

  if (!oldPostgresUrl) {
    throw new Error(
      "Missing OLD_POSTGRES_URL in environment."
    );
  }

  const pg = new PgClient({ connectionString: oldPostgresUrl });
  await pg.connect();
  console.log("Connected to old Postgres database.");

  try {
    const usersResult = await pg.query(`
      SELECT
        "id",
        "email",
        "password",
        "name",
        "role",
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM "User"
      ORDER BY "createdAt" ASC
    `);

    for (const row of usersResult.rows) {
      await prisma.user.create({
        data: {
          id: row.id,
          email: row.email,
          password: row.password,
          name: row.name,
          role: row.role,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      });
    }
    console.log(`Migrated ${usersResult.rows.length} users.`);

    const postsResult = await pg.query(`
      SELECT
        "id",
        "title",
        "slug",
        "excerpt",
        "content",
        "coverImage" AS cover_image,
        "published",
        "authorId" AS author_id,
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM "BlogPost"
      ORDER BY "createdAt" ASC
    `);

    for (const row of postsResult.rows) {
      await prisma.blogPost.create({
        data: {
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          content: row.content,
          coverImage: row.cover_image,
          published: row.published,
          authorId: row.author_id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      });
    }
    console.log(`Migrated ${postsResult.rows.length} blog posts.`);

    const servicesResult = await pg.query(`
      SELECT
        "id",
        "title",
        "description",
        "icon",
        "order",
        "published",
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM "Service"
      ORDER BY "createdAt" ASC
    `);

    for (const row of servicesResult.rows) {
      await prisma.service.create({
        data: {
          id: row.id,
          title: row.title,
          description: row.description,
          icon: row.icon,
          order: row.order,
          published: row.published,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      });
    }
    console.log(`Migrated ${servicesResult.rows.length} services.`);

    const appointmentsResult = await pg.query(`
      SELECT
        "id",
        "patientName" AS patient_name,
        "gender",
        "age",
        "bookingFor" AS booking_for,
        "email",
        "phone",
        "date",
        "time",
        "reason",
        "status",
        "notes",
        "createdAt" AS created_at,
        "updatedAt" AS updated_at
      FROM "Appointment"
      ORDER BY "createdAt" ASC
    `);

    for (const row of appointmentsResult.rows) {
      await prisma.appointment.create({
        data: {
          id: row.id,
          patientName: row.patient_name,
          gender: row.gender,
          age: row.age,
          bookingFor: row.booking_for,
          email: row.email,
          phone: row.phone,
          date: row.date,
          time: row.time,
          reason: row.reason,
          status: row.status,
          notes: row.notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        },
      });
    }
    console.log(`Migrated ${appointmentsResult.rows.length} appointments.`);
    console.log("Migration complete.");
  } finally {
    await pg.end();
  }
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
