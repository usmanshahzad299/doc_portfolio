import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function TestimonialsSkeleton() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-10 w-80 max-w-full animate-pulse rounded-md bg-slate-200" />
            <div className="mx-auto h-6 w-96 max-w-full animate-pulse rounded-md bg-slate-200" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="rounded-2xl border-slate-200">
                <CardContent className="pt-6">
                  <div className="mb-4 h-5 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="mb-2 h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                  <div className="mb-6 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

async function TestimonialsContent() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              What Our Patients Say
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Real experiences from the people we&apos;ve had the privilege to
              serve
            </p>
          </Reveal>

          {testimonials.length === 0 ? (
            <Card className="mx-auto max-w-xl rounded-2xl border-slate-200 bg-white/90">
              <CardContent className="py-10 text-center">
                <p className="font-medium text-slate-800">No reviews yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Patient testimonials will appear here once published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative px-4 md:px-12">
              <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="items-stretch">
                  {testimonials.map((testimonial) => (
                    <CarouselItem
                      key={testimonial.id}
                      className="flex basis-full sm:basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="relative flex h-full w-full flex-col rounded-2xl border-slate-200 bg-white/90 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg">
                        <CardContent className="flex h-full flex-col justify-between pt-6 ">
                          <div>
                            <div className="mb-4 flex">
                              {Array.from({ length: 5 }).map((_, starIndex) => (
                                <svg
                                  key={starIndex}
                                  className={`h-5 w-5 ${
                                    starIndex < testimonial.rating
                                      ? "fill-current text-yellow-400"
                                      : "fill-current text-slate-200"
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                            <p className="mb-6 break-words italic text-gray-600">
                              &quot;{testimonial.content}&quot;
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(testimonial.patientName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {testimonial.patientName}
                              </p>
                              <p className="text-sm text-gray-500">Patient</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:inline-flex" />
                <CarouselNext className="hidden md:inline-flex cursor-pointer" />
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimonialsContent />
    </Suspense>
  );
}
