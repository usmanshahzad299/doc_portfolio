import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { StatCounter } from "@/components/ui/stat-counter";

export function HeroSection() {
  return (
    // <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100/60 pt-12">
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-white">
      {/* <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" /> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal delay={0.05}>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your Health,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
              Providing compassionate, expert medical care with a focus on your
              wellbeing. Experience personalized healthcare that puts you first.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/#appointments">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-blue-600 text-white hover:-translate-y-0.5 hover:bg-blue-700 cursor-pointer"
                >
                  Book Appointment
                </Button>
              </Link>
              <Link href="#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full border-2 border-blue-600 text-blue-600 hover:-translate-y-0.5 hover:bg-blue-50 cursor-pointer"
                >
                  Our Services
                </Button>
              </Link>
            </div>
          </Reveal>

          {/* Stats or Quick Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Reveal delay={0.2}>
              <div className="modern-surface rounded-2xl border border-white/80 p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <StatCounter target={15} suffix="+" />
                </div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="modern-surface rounded-2xl border border-white/80 p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <StatCounter target={5000} suffix="+" />
                </div>
                <div className="text-gray-600">Happy Patients</div>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="modern-surface rounded-2xl border border-white/80 p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <StatCounter target={24} suffix="/7" />
                </div>
                <div className="text-gray-600">Emergency Care</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
