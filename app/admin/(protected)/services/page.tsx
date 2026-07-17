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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
import { ServiceIcon } from "@/components/ui/icon-picker";

type AdminService = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  published: boolean;
  createdAt: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = (await response.json()) as AdminService[];
        setServices(data);
      } catch {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  async function handleDelete(serviceId: string) {
    setDeletingServiceId(serviceId);
    setError("");

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setServices((prev) => prev.filter((service) => service.id !== serviceId));
    } catch {
      setError("Failed to delete service.");
    } finally {
      setDeletingServiceId(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="mt-2 text-gray-600">Manage your service offerings</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <Link href="/admin/services/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create New Service
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-600">
            Loading services...
          </CardContent>
        </Card>
      ) : null}

      {!loading && services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-500">No services yet</p>
            <Link href="/admin/services/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Service
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {!loading && services.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ServiceIcon name={service.icon ?? ""} className="h-7 w-7" />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <Badge
                        className={
                          service.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {service.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {service.description}
                    </CardDescription>
                    <p className="mt-2 text-sm text-gray-500">
                      Created: {format(new Date(service.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Link href={`/admin/services/edit/${service.id}`} prefetch={false}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingServiceId === service.id}
                        >
                          {deletingServiceId === service.id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete "{service.title}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            disabled={deletingServiceId === service.id}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            disabled={deletingServiceId === service.id}
                            onClick={() => handleDelete(service.id)}
                          >
                            {deletingServiceId === service.id
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
