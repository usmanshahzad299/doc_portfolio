import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { BUSINESS_DETAILS } from "@/lib/site-config";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help. Reach out to us for appointments or
              inquiries.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Reveal>
              <Card className="rounded-2xl border-slate-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">📞</span>
                    <span>Phone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{BUSINESS_DETAILS.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Mon-Fri: 8am - 6pm
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.08}>
              <Card className="rounded-2xl border-slate-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">📧</span>
                    <span>Email</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{BUSINESS_DETAILS.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    We&apos;ll respond within 24 hours
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.16}>
              <Card className="rounded-2xl border-slate-200 bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">📍</span>
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {BUSINESS_DETAILS.address.streetAddress}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {BUSINESS_DETAILS.address.addressLocality},{" "}
                    {BUSINESS_DETAILS.address.addressRegion}{" "}
                    {BUSINESS_DETAILS.address.postalCode}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
