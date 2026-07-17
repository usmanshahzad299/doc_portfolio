"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Testimonial = {
  id: string;
  patientName: string;
  content: string;
  rating: number;
  published: boolean;
  createdAt: string;
};

const initialFormData = {
  patientName: "",
  content: "",
  rating: 5,
  published: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) {
          throw new Error("Failed to load testimonials");
        }

        const data = (await response.json()) as Testimonial[];
        setTestimonials(data);
      } catch {
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create testimonial");
      }

      const created = (await response.json()) as Testimonial;
      setTestimonials((prev) => [created, ...prev]);
      setFormData(initialFormData);
    } catch {
      setError("Failed to create testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(testimonial: Testimonial) {
    setTogglingId(testimonial.id);
    setError("");

    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !testimonial.published }),
      });

      if (!response.ok) {
        throw new Error("Failed to update publish status");
      }

      const updated = (await response.json()) as Testimonial;
      setTestimonials((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch {
      setError("Failed to update publish status.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete testimonial.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <p className="mt-2 text-gray-600">Create and manage patient reviews.</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
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
                rows={4}
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

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Testimonial"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Manage Testimonials</h2>
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              Loading testimonials...
            </CardContent>
          </Card>
        ) : testimonials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No testimonials yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.patientName}
                        </h3>
                        <Badge
                          className={
                            testimonial.published
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {testimonial.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="mb-3 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={togglingId === testimonial.id}
                        onClick={() => togglePublished(testimonial)}
                      >
                        {togglingId === testimonial.id
                          ? "Updating..."
                          : testimonial.published
                            ? "Unpublish"
                            : "Publish"}
                      </Button>
                      <Link href={`/admin/testimonials/edit/${testimonial.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === testimonial.id}
                          >
                            {deletingId === testimonial.id ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete testimonial by {testimonial.patientName}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(testimonial.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
