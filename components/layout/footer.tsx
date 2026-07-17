import Link from "next/link";
import { BUSINESS_DETAILS } from "@/lib/site-config";

export function Footer() {
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
                <Link href="/#about" className="hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#specializations" className="hover:text-blue-400 transition-colors">
                  Specializations
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#appointments" className="hover:text-blue-400 transition-colors">
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>📞 {BUSINESS_DETAILS.phone}</li>
              <li>📧 {BUSINESS_DETAILS.email}</li>
              <li>📍 {BUSINESS_DETAILS.address.streetAddress}</li>
              <li>
                {BUSINESS_DETAILS.address.addressLocality},{" "}
                {BUSINESS_DETAILS.address.addressRegion}{" "}
                {BUSINESS_DETAILS.address.postalCode}
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hours</h4>
            <ul className="space-y-2">
              <li>Monday - Friday: 8am - 6pm</li>
              <li>Saturday: 9am - 2pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} Dr. Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
