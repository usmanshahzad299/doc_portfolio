"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

type BlogFormData = {
  title: string;
  description: string;
  coverImage: string;
  published: boolean;
};

const initialFormData: BlogFormData = {
  title: "",
  description: "",
  coverImage: "",
  published: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    async function loadPost() {
      if (!id) return;

      try {
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const post = await response.json();
        setFormData({
          title: post.title ?? "",
          description: post.content ?? "",
          coverImage: post.coverImage ?? "",
          published: Boolean(post.published),
        });
      } catch {
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
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

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  async function uploadImageIfSelected() {
    if (!selectedImage) {
      return formData.coverImage;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedImage);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    const uploadResult = await uploadResponse.json();
    return String(uploadResult.url ?? "");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      const coverImageUrl = await uploadImageIfSelected();
      const title = formData.title.trim();
      const description = formData.description.trim();
      const plainDescription = description.replace(/<[^>]+>/g, "");
      const payload = {
        title,
        slug: slugify(title),
        excerpt: plainDescription.slice(0, 150),
        content: description,
        coverImage: coverImageUrl,
        published: formData.published,
      };

      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      router.push("/admin/blog");
    } catch {
      setError("Failed to update blog post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              Loading post...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <Link href="/admin/blog">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="coverImageFile">Cover Image</Label>
                <Input
                  id="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {imagePreviewUrl || formData.coverImage ? (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl || formData.coverImage}
                    alt="Selected cover preview"
                    className="h-48 w-full rounded-md border object-cover"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) =>
                    setFormData((prev) => ({ ...prev, description: html }))
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-blue-600"
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
                <Link href="/admin/blog">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
