import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdminUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });
  if (!user || user.role.toLowerCase() !== "admin") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(specializations);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    return NextResponse.json(
      { error: "Failed to fetch specializations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const total = await prisma.specialization.count();
    if (total >= 4) {
      return NextResponse.json(
        { error: "Maximum limit of 4 specializations reached." },
        { status: 400 }
      );
    }

    const specialization = await prisma.specialization.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(specialization, { status: 201 });
  } catch (error) {
    console.error("Error creating specialization:", error);
    return NextResponse.json(
      { error: "Failed to create specialization" },
      { status: 500 }
    );
  }
}
