"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

type AdminSpecialization = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

const MAX_SPECIALIZATIONS = 4;

export default function AdminSpecializationsPage() {
  const [specializations, setSpecializations] = useState<AdminSpecialization[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    async function loadSpecializations() {
      try {
        const response = await fetch("/api/specializations");
        if (!response.ok) {
          throw new Error("Failed to fetch specializations");
        }
        const data = (await response.json()) as AdminSpecialization[];
        setSpecializations(data);
      } catch {
        setError("Failed to load specializations.");
      } finally {
        setLoading(false);
      }
    }

    loadSpecializations();
  }, []);

  const isAtLimit = specializations.length >= MAX_SPECIALIZATIONS;

  async function handleCreate() {
    setError("");

    const title = newTitle.trim();
    const description = newDescription.trim();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/specializations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Failed to create specialization");
      }

      setSpecializations((prev) => [...prev, result as AdminSpecialization]);
      setNewTitle("");
      setNewDescription("");
      setShowCreateForm(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create specialization."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(item: AdminSpecialization) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function handleUpdate(itemId: string) {
    setError("");
    const title = editTitle.trim();
    const description = editDescription.trim();

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/specializations/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Failed to update specialization");
      }

      setSpecializations((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                title,
                description,
              }
            : item
        )
      );
      cancelEditing();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update specialization."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId: string) {
    setDeletingId(itemId);
    setError("");
    try {
      const response = await fetch(`/api/specializations/${itemId}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete specialization");
      }

      setSpecializations((prev) => prev.filter((item) => item.id !== itemId));
      if (editingId === itemId) {
        cancelEditing();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete specialization."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Specializations</h1>
          <p className="mt-2 text-gray-600">Manage your specialization cards</p>
          <p className="mt-2 text-sm font-medium text-blue-700">
            {specializations.length} / {MAX_SPECIALIZATIONS} Specializations Used
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateForm((prev) => !prev)}
            disabled={isAtLimit}
          >
            Add Specialization
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isAtLimit ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Maximum limit of 4 specializations reached.
        </div>
      ) : null}

      {showCreateForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Specialization</CardTitle>
            <CardDescription>
              Create a specialization card for the public section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="e.g. Internal Medicine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                rows={4}
                placeholder="Describe this specialization."
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Specialization"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            Loading specializations...
          </CardContent>
        </Card>
      ) : null}

      {!loading && specializations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            No specializations added yet.
          </CardContent>
        </Card>
      ) : null}

      {!loading && specializations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {specializations.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
                      <Input
                        id={`edit-title-${item.id}`}
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-description-${item.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`edit-description-${item.id}`}
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUpdate(item.id)}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="mt-3 text-base">
                        {item.description}
                      </CardDescription>
                      <p className="mt-3 text-sm text-gray-500">
                        Created: {format(new Date(item.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(item)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{item.title}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={deletingId === item.id}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              disabled={deletingId === item.id}
                              onClick={() => handleDelete(item.id)}
                            >
                              {deletingId === item.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
