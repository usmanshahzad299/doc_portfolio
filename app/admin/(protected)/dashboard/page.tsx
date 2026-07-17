import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, FileText, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {session.user?.name ?? "Dr. Admin"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Use the sidebar to manage blog posts and appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/blog/new"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Plus className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Create new post</p>
            <p className="mt-0.5 text-xs text-gray-400">Write a fresh entry</p>
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Manage blog posts</p>
            <p className="mt-0.5 text-xs text-gray-400">Edit or delete posts</p>
          </div>
        </Link>

        <Link
          href="/admin/appointments"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">View appointments</p>
            <p className="mt-0.5 text-xs text-gray-400">Check upcoming visits</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
