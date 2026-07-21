import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_FALLBACK } from "@/lib/site-settings";

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

const REQUIRED_TEXT_FIELDS = [
  "bioParagraph",
  "stat1Value",
  "stat2Value",
  "contactPhone",
  "contactEmail",
  "addressStreet",
  "addressLocality",
  "addressRegion",
  "addressPostal",
  "mondayHours",
  "tuesdayHours",
  "wednesdayHours",
  "thursdayHours",
  "fridayHours",
  "saturdayHours",
  "sundayHours",
] as const;

type RequiredTextField = (typeof REQUIRED_TEXT_FIELDS)[number];

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json(settings ?? SITE_SETTINGS_FALLBACK);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(SITE_SETTINGS_FALLBACK);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAdminUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const cleaned = Object.fromEntries(
      REQUIRED_TEXT_FIELDS.map((field) => [field, String(body[field] ?? "").trim()])
    ) as Record<RequiredTextField, string>;

    const missingField = REQUIRED_TEXT_FIELDS.find((field) => !cleaned[field]);
    if (missingField) {
      return NextResponse.json(
        { error: `${missingField} is required` },
        { status: 400 }
      );
    }

    const aboutImageRaw = body.aboutImage;
    const aboutImage =
      typeof aboutImageRaw === "string" && aboutImageRaw.trim()
        ? aboutImageRaw.trim()
        : null;

    const settings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: {
        aboutImage,
        ...cleaned,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2000"
    ) {
      return NextResponse.json(
        {
          error:
            "Image upload failed because the image data is too large for storage. Please choose a smaller image.",
        },
        { status: 400 }
      );
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        {
          error:
            "Site settings record is missing. Please run the seed once, then try again.",
        },
        { status: 500 }
      );
    }
    const detail =
      error instanceof Error
        ? error.message
        : "Unexpected server error while updating settings.";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Failed to update settings"
            : `Failed to update settings: ${detail}`,
      },
      { status: 500 }
    );
  }
}
