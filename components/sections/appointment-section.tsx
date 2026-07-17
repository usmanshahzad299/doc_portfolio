"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/ui/reveal";
import { BUSINESS_DETAILS } from "@/lib/site-config";

type AppointmentFormData = {
  patientName: string;
  gender: string;
  age: string;
  bookingFor: "self" | "someone_else";
  email: string;
  phone: string;
  appointmentType: string;
  date: string;
  time: string;
  additionalInfo: string;
};

const initialFormData: AppointmentFormData = {
  patientName: "",
  gender: "",
  age: "",
  bookingFor: "self",
  email: "",
  phone: "",
  appointmentType: "",
  date: "",
  time: "",
  additionalInfo: "",
};

export function AppointmentSection() {
  const [formData, setFormData] =
    useState<AppointmentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.gender) {
      setError("Please select gender.");
      setLoading(false);
      return;
    }

    const reason = [
      formData.appointmentType ? `Type: ${formData.appointmentType}` : "",
      formData.additionalInfo ? `Details: ${formData.additionalInfo}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formData.patientName,
          gender: formData.gender,
          age: formData.age,
          bookingFor: formData.bookingFor,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          reason: reason || "General appointment request",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request appointment");
      }

      setSuccess(true);
      setFormData(initialFormData);
    } catch {
      setError("Could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="appointments" className="bg-slate-100 py-20 gradient-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Schedule an Appointment
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Taking new patients and accepting most insurance plans. Book your
              appointment today and take the first step toward better health.
            </p>
          </Reveal>

          <div className="grid items-stretch gap-8 md:grid-cols-5">
            <Reveal className="md:col-span-3">
              <Card className="rounded-2xl border-slate-200 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">
                    Request an Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {success ? (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">
                      <p className="font-semibold">
                        Request submitted successfully.
                      </p>
                      <p className="mt-1 text-sm">
                        We&apos;ll contact you shortly to confirm your
                        appointment.
                      </p>
                      <Button
                        className="mt-4 bg-green-600 hover:bg-green-700"
                        onClick={() => setSuccess(false)}
                      >
                        Request Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          {error}
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <Label htmlFor="patientName">Full Name *</Label>
                        <Input
                          id="patientName"
                          name="patientName"
                          placeholder="John Doe"
                          value={formData.patientName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age *</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            min={0}
                            max={120}
                            placeholder="30"
                            value={formData.age}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender *</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              handleSelectChange("gender", value)
                            }
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bookingFor">Booking For *</Label>
                          <Select
                            value={formData.bookingFor}
                            onValueChange={(value) =>
                              handleSelectChange("bookingFor", value)
                            }
                          >
                            <SelectTrigger id="bookingFor">
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self">Myself</SelectItem>
                              <SelectItem value="someone_else">
                                Someone else
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="appointmentType">
                            Appointment Type
                          </Label>
                          <Input
                            id="appointmentType"
                            name="appointmentType"
                            placeholder="General checkup"
                            value={formData.appointmentType}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Preferred Date *</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time *</Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">
                          Additional Information
                        </Label>
                        <Textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          rows={4}
                          placeholder="Please share any specific concerns or questions..."
                          value={formData.additionalInfo}
                          onChange={handleChange}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="h-11 w-full rounded-lg text-white bg-blue-700 hover:bg-blue-800"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Request Appointment"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </Reveal>

            <Reveal
              className="relative md:col-span-2 md:h-full md:pl-12 before:hidden md:before:block before:absolute before:left-0 before:top-12 before:bottom-12 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-blue-600/10 before:via-blue-600 before:to-blue-600/10"
              delay={0.1}
            >
              <h2 className="text-4xl text-center font-bold text-blue-600 mb-4">
                Get In Touch
              </h2>
              <div className="space-y-6 md:h-full">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Phone
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Main: {BUSINESS_DETAILS.phone}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="pt-6">
                      <p className="text-sm font-semibold text-slate-900">
                        Email
                      </p>
                      <p className="mt-2 text-sm text-slate-600 break-all">
                        {BUSINESS_DETAILS.email}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="pt-6">
                      <p className="text-sm font-semibold text-slate-900">
                        Location
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {BUSINESS_DETAILS.address.streetAddress}
                      </p>
                      <p className="text-sm text-slate-600">
                        {BUSINESS_DETAILS.address.addressLocality},{" "}
                        {BUSINESS_DETAILS.address.addressRegion}{" "}
                        {BUSINESS_DETAILS.address.postalCode}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="pt-6">
                      <p className="text-sm font-semibold text-slate-900">
                        Hours
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Mon-Fri: 8:00 AM - 6:00 PM
                      </p>
                      <p className="text-sm text-slate-600">
                        Sat: 9:00 AM - 2:00 PM
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-100 to-indigo-200 p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">
                    Patient-first care
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Fast scheduling. Personalized treatment.
                  </h3>
                  <p className="mt-3 max-w-md text-slate-700">
                    Our team reviews all requests quickly and follows up with
                    clear next steps.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
