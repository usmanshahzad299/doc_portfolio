"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type TestimonialFormData = {
  patientName: string;
  content: string;
  rating: number;
  published: boolean;
};

const initialFormData: TestimonialFormData = {
  patientName: "",
  content: "",
  rating: 5,
  published: false,
};

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTestimonial() {
      if (!id) return;

      try {
        const response = await fetch(`/api/testimonials/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch testimonial");
        }

        const testimonial = await response.json();
        setFormData({
          patientName: testimonial.patientName ?? "",
          content: testimonial.content ?? "",
          rating: Number(testimonial.rating) || 5,
          published: Boolean(testimonial.published),
        });
      } catch {
        setError("Failed to load testimonial.");
      } finally {
        setLoading(false);
      }
    }

    loadTestimonial();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update testimonial");
      }

      router.push("/admin/testimonials");
    } catch {
      setError("Failed to update testimonial.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-600">
          Loading testimonial...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Edit Testimonial</h1>
        <Link href="/admin/testimonials">
          <Button variant="outline">← Back</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    patientName: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const active = value <= formData.rating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: value }))
                      }
                      className="rounded p-1 transition hover:scale-105"
                      aria-label={`Set rating to ${value}`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          active
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                rows={5}
                value={formData.content}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, content: event.target.value }))
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="published"
                type="checkbox"
                className="h-4 w-4 rounded text-blue-600"
                checked={formData.published}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: event.target.checked,
                  }))
                }
              />
              <Label htmlFor="published" className="cursor-pointer">
                Published
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/admin/testimonials">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
