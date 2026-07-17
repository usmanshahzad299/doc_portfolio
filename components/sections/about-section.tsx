import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-4 relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100/60 pt-12 animate-in fade-in duration-700 "
    >
      <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Reveal className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                  Trusted Healthcare Professional • Evidence-Based Care
                </span>
              </Reveal>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image placeholder - you can replace with actual doctor photo */}
            {/* Content */}
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Dedicated to Your Health and Wellness
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    With over 15 years of experience in medicine, I am committed
                    to providing exceptional healthcare services tailored to
                    each patient&apos;s unique needs.
                  </p>
                  <p>
                    My approach combines evidence-based medicine with
                    compassionate care, ensuring that every patient receives the
                    attention and treatment they deserve.
                  </p>
                  {/* <p>
                    I believe in building lasting relationships with my
                    patients, taking the time to listen, understand, and address
                    their concerns with professionalism and empathy.
                  </p> */}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        Board Certified
                      </div>
                      <div className="text-sm text-gray-600">
                        Licensed Practitioner
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        15+ Years
                      </div>
                      <div className="text-sm text-gray-600">
                        Clinical Experience
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.15}>
                <div className="w-full max-w-[500px] mx-auto">
                  <Image
                    src="/docImage.png"
                    alt="Doctor"
                    width={500}
                    height={500}
                    className="rounded-2xl object-cover w-full h-auto"
                  />
                </div>
                <div className="flex flex-col gap-4 justify-center items-center">
                  <Link href="/#appointments" className="w-full">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 mt-4 rounded-full bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 cursor-pointer w-full"
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* <Reveal className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-48 h-48 mx-auto bg-blue-200 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-32 h-32 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Professional Photo</p>
                </div>
              </div>
            </Reveal> */}
          </div>
        </div>
      </div>
    </section>
  );
}
