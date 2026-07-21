import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { getSiteSettings } from "@/lib/site-settings";
import { AnimatedNumber } from "../ui/animated-number";

export async function AboutSection() {
  noStore();
  const settings = await getSiteSettings();

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
            <Reveal delay={0.1} className="order-2 md:order-1">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Dedicated to Your Health and Wellness
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p className="whitespace-pre-line">{settings.bioParagraph}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="min-h-[88px] pt-6">
                      <div className="mb-1 line-clamp-1 text-2xl font-bold text-blue-600">
                        {/* {settings.stat1Value} */}
                        <AnimatedNumber value={settings.stat1Value} />
                      </div>
                      <div className="line-clamp-2 text-sm text-gray-600">
                        Clinical Experience
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="min-h-[88px] pt-6">
                      <div className="mb-1 line-clamp-1 text-2xl font-bold text-blue-600">
                        {/* {settings.stat2Value} */}
                        <AnimatedNumber value={settings.stat2Value} />
                      </div>
                      <div className="line-clamp-2 text-sm text-gray-600">
                        Patients Served
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Reveal>
            <div className="order-1 md:order-2">
              <Reveal delay={0.15}>
                <div className="relative w-full sm:max-w-[500px] sm:mx-auto aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={settings.aboutImage || "/Dr_Ali_image.png"}
                    alt="Doctor"
                    fill
                    className="object-cover"
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
          </div>
        </div>
      </div>
    </section>
  );
}
