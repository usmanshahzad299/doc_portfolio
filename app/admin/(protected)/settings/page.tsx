"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WORKING_HOUR_FIELDS, type WorkingHourField } from "@/lib/utils";

type SettingsFormData = {
  aboutImage: string;
  bioParagraph1: string;
  bioParagraph2: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  contactPhone: string;
  contactEmail: string;
  addressStreet: string;
  addressLocality: string;
  addressRegion: string;
  addressPostal: string;
  mondayHours: string;
  tuesdayHours: string;
  wednesdayHours: string;
  thursdayHours: string;
  fridayHours: string;
  saturdayHours: string;
  sundayHours: string;
};

const initialFormData: SettingsFormData = {
  aboutImage: "",
  bioParagraph1: "",
  bioParagraph2: "",
  stat1Value: "",
  stat1Label: "",
  stat2Value: "",
  stat2Label: "",
  contactPhone: "",
  contactEmail: "",
  addressStreet: "",
  addressLocality: "",
  addressRegion: "",
  addressPostal: "",
  mondayHours: "",
  tuesdayHours: "",
  wednesdayHours: "",
  thursdayHours: "",
  fridayHours: "",
  saturdayHours: "",
  sundayHours: "",
};

const requiredFields: (keyof Omit<SettingsFormData, "aboutImage">)[] = [
  "bioParagraph1",
  "bioParagraph2",
  "stat1Value",
  "stat1Label",
  "stat2Value",
  "stat2Label",
  "contactPhone",
  "contactEmail",
  "addressStreet",
  "addressLocality",
  "addressRegion",
  "addressPostal",
];

type WorkingDayState = {
  closed: boolean;
  startTime: string;
  endTime: string;
};

type WorkingHoursState = Record<WorkingHourField, WorkingDayState>;

const DEFAULT_DAY_STATE: WorkingDayState = {
  closed: false,
  startTime: "09:00",
  endTime: "17:00",
};

function to24Hour(hour: number, meridiem: string) {
  const normalizedMeridiem = meridiem.toUpperCase();
  if (normalizedMeridiem === "AM") {
    return hour % 12;
  }
  return (hour % 12) + 12;
}

function parseStoredHours(hours: string): WorkingDayState {
  const trimmed = hours.trim();
  if (!trimmed || trimmed.toLowerCase() === "closed") {
    return { ...DEFAULT_DAY_STATE, closed: true };
  }

  const match = trimmed.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (!match) {
    return { ...DEFAULT_DAY_STATE, closed: true };
  }

  const startHour = Number(match[1]);
  const startMinute = Number(match[2]);
  const startMeridiem = match[3];
  const endHour = Number(match[4]);
  const endMinute = Number(match[5]);
  const endMeridiem = match[6];

  const start24Hour = to24Hour(startHour, startMeridiem);
  const end24Hour = to24Hour(endHour, endMeridiem);

  const startTime = `${String(start24Hour).padStart(2, "0")}:${String(
    startMinute,
  ).padStart(2, "0")}`;
  const endTime = `${String(end24Hour).padStart(2, "0")}:${String(
    endMinute,
  ).padStart(2, "0")}`;

  return {
    closed: false,
    startTime,
    endTime,
  };
}

function parseWorkingHoursFromSettings(
  settings: Pick<
    SettingsFormData,
    | "mondayHours"
    | "tuesdayHours"
    | "wednesdayHours"
    | "thursdayHours"
    | "fridayHours"
    | "saturdayHours"
    | "sundayHours"
  >,
): WorkingHoursState {
  return Object.fromEntries(
    WORKING_HOUR_FIELDS.map((field) => [
      field.key,
      parseStoredHours(settings[field.key]),
    ]),
  ) as WorkingHoursState;
}

function formatTimeForStorage(timeValue: string) {
  const [hourRaw, minuteRaw] = timeValue.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const meridiem = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0",
  )} ${meridiem}`;
}

function formatWorkingHoursForStorage(hoursState: WorkingHoursState) {
  return Object.fromEntries(
    WORKING_HOUR_FIELDS.map((field) => {
      const dayState = hoursState[field.key];
      if (dayState.closed) {
        return [field.key, "Closed"];
      }
      return [
        field.key,
        `${formatTimeForStorage(dayState.startTime)} - ${formatTimeForStorage(
          dayState.endTime,
        )}`,
      ];
    }),
  ) as Pick<
    SettingsFormData,
    | "mondayHours"
    | "tuesdayHours"
    | "wednesdayHours"
    | "thursdayHours"
    | "fridayHours"
    | "saturdayHours"
    | "sundayHours"
  >;
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [workingHours, setWorkingHours] = useState<WorkingHoursState>(() =>
    parseWorkingHoursFromSettings(initialFormData),
  );

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const settings = await response.json();
        const nextFormData = {
          aboutImage: settings.aboutImage ?? "",
          bioParagraph1: settings.bioParagraph1 ?? "",
          bioParagraph2: settings.bioParagraph2 ?? "",
          stat1Value: settings.stat1Value ?? "",
          stat1Label: settings.stat1Label ?? "",
          stat2Value: settings.stat2Value ?? "",
          stat2Label: settings.stat2Label ?? "",
          contactPhone: settings.contactPhone ?? "",
          contactEmail: settings.contactEmail ?? "",
          addressStreet: settings.addressStreet ?? "",
          addressLocality: settings.addressLocality ?? "",
          addressRegion: settings.addressRegion ?? "",
          addressPostal: settings.addressPostal ?? "",
          mondayHours: settings.mondayHours ?? "",
          tuesdayHours: settings.tuesdayHours ?? "",
          wednesdayHours: settings.wednesdayHours ?? "",
          thursdayHours: settings.thursdayHours ?? "",
          fridayHours: settings.fridayHours ?? "",
          saturdayHours: settings.saturdayHours ?? "",
          sundayHours: settings.sundayHours ?? "",
        };
        setFormData(nextFormData);
        setWorkingHours(parseWorkingHoursFromSettings(nextFormData));
      } catch {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const hasEmptyRequired = useMemo(
    () => requiredFields.some((field) => !formData[field].trim()),
    [formData],
  );

  const hasInvalidWorkingHours = useMemo(
    () =>
      WORKING_HOUR_FIELDS.some((field) => {
        const dayState = workingHours[field.key];
        if (dayState.closed) {
          return false;
        }
        if (!dayState.startTime || !dayState.endTime) {
          return true;
        }
        return dayState.startTime >= dayState.endTime;
      }),
    [workingHours],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImage(file);

    if (!file) {
      setImagePreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const handleClosedToggle = (field: WorkingHourField, closed: boolean) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        closed,
      },
    }));
  };

  const handleTimeChange = (
    field: WorkingHourField,
    timeField: "startTime" | "endTime",
    value: string,
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [timeField]: value,
      },
    }));
  };

  async function uploadImageIfSelected() {
    if (!selectedImage) {
      return formData.aboutImage;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedImage);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.json().catch(() => null);
      const uploadMessage = uploadError?.error || "Unknown upload error";
      throw new Error(
        `Image upload failed (${uploadResponse.status}): ${uploadMessage}`,
      );
    }

    const uploadResult = await uploadResponse.json();
    return String(uploadResult.url ?? "");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (hasEmptyRequired) {
      setError("All required fields must be filled before saving.");
      return;
    }
    if (hasInvalidWorkingHours) {
      setError(
        "Each open day must have a valid start and end time (start must be before end).",
      );
      return;
    }

    setSaving(true);

    try {
      const aboutImageUrl = await uploadImageIfSelected();
      const formattedWorkingHours = formatWorkingHoursForStorage(workingHours);
      const payload = {
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, value.trim()]),
        ),
        ...formattedWorkingHours,
        aboutImage: aboutImageUrl,
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
          result?.error || `Failed to save settings (HTTP ${response.status})`,
        );
      }

      const updated = await response.json();
      setFormData((prev) => ({
        ...prev,
        aboutImage: updated.aboutImage ?? "",
        ...formattedWorkingHours,
      }));
      setWorkingHours(parseWorkingHoursFromSettings(formattedWorkingHours));
      setSelectedImage(null);
      setImagePreviewUrl("");
      setSuccess("Settings saved successfully.");
    } catch (err) {
      console.error("Failed to save site settings:", err);
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-600">
          Loading site settings...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage personal information shown on public pages.
          </p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">← Dashboard</Button>
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aboutImageFile">About Image</Label>
              <Input
                id="aboutImageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {imagePreviewUrl || formData.aboutImage ? (
              <div className="space-y-2">
                <Label>Image Preview</Label>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewUrl || formData.aboutImage}
                  alt="About image preview"
                  className="h-56 w-full rounded-md border object-cover"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="bioParagraph1">Bio Paragraph 1 *</Label>
              <Textarea
                id="bioParagraph1"
                name="bioParagraph1"
                value={formData.bioParagraph1}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bioParagraph2">Bio Paragraph 2 *</Label>
              <Textarea
                id="bioParagraph2"
                name="bioParagraph2"
                value={formData.bioParagraph2}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stat1Value">Stat 1 Value *</Label>
                <Input
                  id="stat1Value"
                  name="stat1Value"
                  value={formData.stat1Value}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat1Label">Stat 1 Label *</Label>
                <Input
                  id="stat1Label"
                  name="stat1Label"
                  value={formData.stat1Label}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stat2Value">Stat 2 Value *</Label>
                <Input
                  id="stat2Value"
                  name="stat2Value"
                  value={formData.stat2Value}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat2Label">Stat 2 Label *</Label>
                <Input
                  id="stat2Label"
                  name="stat2Label"
                  value={formData.stat2Label}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Street Address *</Label>
              <Input
                id="addressStreet"
                name="addressStreet"
                value={formData.addressStreet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="addressLocality">City *</Label>
                <Input
                  id="addressLocality"
                  name="addressLocality"
                  value={formData.addressLocality}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressRegion">Region *</Label>
                <Input
                  id="addressRegion"
                  name="addressRegion"
                  value={formData.addressRegion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressPostal">Postal Code *</Label>
                <Input
                  id="addressPostal"
                  name="addressPostal"
                  value={formData.addressPostal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {WORKING_HOUR_FIELDS.map((field) => {
              const dayState = workingHours[field.key];
              return (
                <div
                  key={field.key}
                  className="rounded-lg border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${field.key}-start`}>{field.label}</Label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={dayState.closed}
                        onChange={(event) =>
                          handleClosedToggle(field.key, event.target.checked)
                        }
                      />
                      Closed
                    </label>
                  </div>
                  {!dayState.closed ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${field.key}-start`}>Start Time</Label>
                        <Input
                          id={`${field.key}-start`}
                          type="time"
                          value={dayState.startTime}
                          onChange={(event) =>
                            handleTimeChange(
                              field.key,
                              "startTime",
                              event.target.value,
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${field.key}-end`}>End Time</Label>
                        <Input
                          id={`${field.key}-end`}
                          type="time"
                          value={dayState.endTime}
                          onChange={(event) =>
                            handleTimeChange(
                              field.key,
                              "endTime",
                              event.target.value,
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {hasInvalidWorkingHours ? (
              <p className="text-sm text-red-600">
                One or more open days has invalid hours. Ensure start time is
                earlier than end time.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={saving || hasEmptyRequired || hasInvalidWorkingHours}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
