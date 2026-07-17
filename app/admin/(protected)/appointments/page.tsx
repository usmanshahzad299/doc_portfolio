import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminAppointmentsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "asc" },
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage patient appointments</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">← Dashboard</Button>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No appointments yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        {appointment.patientName}
                      </CardTitle>
                      <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 {format(new Date(appointment.date), "MMMM dd, yyyy")} at {appointment.time}</p>
                      <p>📧 {appointment.email}</p>
                      <p>📞 {appointment.phone}</p>
                      <p className="mt-2"><strong>Reason:</strong> {appointment.reason}</p>
                      {appointment.notes && (
                        <p className="mt-2"><strong>Notes:</strong> {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
