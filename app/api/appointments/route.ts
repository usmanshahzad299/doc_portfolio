import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientName, gender, age, bookingFor, email, phone, date, time, reason } = body;

    // Validate required fields
    if (!patientName || !email || !phone || !date || !time || !reason) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        gender: gender || null,
        age: age ? Number(age) : null,
        bookingFor: bookingFor || "self",
        email,
        phone,
        date: new Date(date),
        time,
        reason,
        status: "pending",
      },
    });

    return NextResponse.json(
      { message: "Appointment booked successfully", appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
