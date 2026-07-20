import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { BUSINESS_DETAILS } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/site-settings";
import { getGroupedWorkingHours } from "@/lib/utils";

export async function Footer() {
  noStore();
  const settings = await getSiteSettings();
  const groupedWorkingHours = getGroupedWorkingHours(settings);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              {BUSINESS_DETAILS.name}
            </h3>
            <p className="text-slate-400">
              Providing exceptional healthcare with compassion and expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#specializations"
                  className="hover:text-blue-400 transition-colors"
                >
                  Specializations
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#appointments"
                  className="hover:text-blue-400 transition-colors"
                >
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="break-words cursor-pointer hover:text-blue-400 transition-colors">
                📞 {settings.contactPhone}
              </li>
              <li className="break-words cursor-pointer hover:text-blue-400 transition-colors">
                📧 {settings.contactEmail}
              </li>
              <li className="break-words cursor-pointer hover:text-blue-400 transition-colors">
                📍 {settings.addressStreet}
              </li>
              <li>
                <span className="break-words cursor-pointer hover:text-blue-400 transition-colors">
                  {settings.addressLocality}, {settings.addressRegion}{" "}
                  {settings.addressPostal}
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hours</h4>
            <div>
              {groupedWorkingHours.map(({ days, hours }) => {
                const isClosed = hours.trim().toLowerCase() === "closed";
                return (
                  <div
                    key={days}
                    className="flex items-center justify-between border-b border-white/10 py-2 last:border-b-0"
                  >
                    <span className="text-sm text-slate-300 cursor-pointer">
                      {days}
                    </span>
                    <span
                      className={[
                        "text-right text-sm font-semibold whitespace-nowrap",
                        isClosed ? "text-slate-400" : "text-white",
                      ].join(" ")}
                    >
                      {hours}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Dr. Ali Akbar Portfolio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
