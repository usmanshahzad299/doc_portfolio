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
  bioParagraph: string;
  stat1Value: string;
  stat2Value: string;
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
  bioParagraph: "",
  stat1Value: "",
  stat2Value: "",
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
  "bioParagraph",
  "stat1Value",
  "stat2Value",
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
type BulkApplyDaysState = Record<WorkingHourField, boolean>;

const DEFAULT_DAY_STATE: WorkingDayState = {
  closed: false,
  startTime: "09:00",
  endTime: "17:00",
};

const DEFAULT_BULK_APPLY_DAYS: BulkApplyDaysState = {
  mondayHours: true,
  tuesdayHours: true,
  wednesdayHours: true,
  thursdayHours: true,
  fridayHours: true,
  saturdayHours: false,
  sundayHours: false,
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
  const [defaultSchedule, setDefaultSchedule] = useState({
    startTime: "09:00",
    endTime: "17:00",
  });
  const [bulkApplyDays, setBulkApplyDays] = useState<BulkApplyDaysState>(
    DEFAULT_BULK_APPLY_DAYS,
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
          bioParagraph: settings.bioParagraph ?? "",
          stat1Value: settings.stat1Value ?? "",
          stat2Value: settings.stat2Value ?? "",
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

  const handleBulkDayToggle = (field: WorkingHourField, checked: boolean) => {
    setBulkApplyDays((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const applyDefaultScheduleToSelectedDays = () => {
    if (defaultSchedule.startTime >= defaultSchedule.endTime) {
      setError("Default schedule start time must be earlier than end time.");
      return;
    }

    setError("");
    setWorkingHours((prev) => {
      const next = { ...prev };
      for (const field of WORKING_HOUR_FIELDS) {
        if (!bulkApplyDays[field.key]) {
          continue;
        }
        next[field.key] = {
          closed: false,
          startTime: defaultSchedule.startTime,
          endTime: defaultSchedule.endTime,
        };
      }
      return next;
    });
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
              <Label htmlFor="bioParagraph">Biography *</Label>
              <Textarea
                id="bioParagraph"
                name="bioParagraph"
                value={formData.bioParagraph}
                onChange={handleChange}
                rows={7}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stat1Value">Clinical Experience Value *</Label>
                <Input
                  id="stat1Value"
                  name="stat1Value"
                  placeholder="15+ Years"
                  value={formData.stat1Value}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stat2Value">Patients Served Value *</Label>
                <Input
                  id="stat2Value"
                  name="stat2Value"
                  placeholder="10,000+"
                  value={formData.stat2Value}
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
            <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 space-y-4">
              <p className="text-sm font-semibold text-slate-900">Default Schedule</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-schedule-start">Start Time</Label>
                  <Input
                    id="default-schedule-start"
                    type="time"
                    value={defaultSchedule.startTime}
                    onChange={(event) =>
                      setDefaultSchedule((prev) => ({
                        ...prev,
                        startTime: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-schedule-end">End Time</Label>
                  <Input
                    id="default-schedule-end"
                    type="time"
                    value={defaultSchedule.endTime}
                    onChange={(event) =>
                      setDefaultSchedule((prev) => ({
                        ...prev,
                        endTime: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-800">
                  Apply to selected days
                </p>
                <div className="grid gap-2 sm:grid-cols-4">
                  {WORKING_HOUR_FIELDS.map((field) => (
                    <label
                      key={`bulk-${field.key}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={bulkApplyDays[field.key]}
                        onChange={(event) =>
                          handleBulkDayToggle(field.key, event.target.checked)
                        }
                      />
                      {field.short}
                    </label>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyDefaultScheduleToSelectedDays}
                >
                  Apply to Selected Days
                </Button>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-900">Per-day Overrides</p>
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
