"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  MessageSquareQuote,
  Settings,
  Stethoscope,
} from "lucide-react";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Blog Management",
    href: "/admin/blog",
    icon: FileText,
    isActive: (pathname: string) => pathname.startsWith("/admin/blog"),
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
    isActive: (pathname: string) => pathname.startsWith("/admin/appointments"),
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    isActive: (pathname: string) => pathname.startsWith("/admin/testimonials"),
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Stethoscope,
    isActive: (pathname: string) => pathname.startsWith("/admin/services"),
  },
  {
    label: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
    isActive: (pathname: string) => pathname.startsWith("/admin/settings"),
  },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 via-white to-indigo-100/60 flex flex-col">
      <header className="border-b">
        <div className="px-4 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
              DR
            </span>
            <span className="text-2xl font-bold text-blue-600">
              Dr. Portfolio
            </span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-stretch md:min-h-[calc(100vh-77px)] md:flex-row ">
        <aside className="w-full border-b py-5 bg-white md:w-56 md:shrink-0 md:self-stretch md:border-r md:border-b-0">
          <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.isActive(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
