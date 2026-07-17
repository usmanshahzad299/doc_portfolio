"use client";

import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/icon-picker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  published: boolean;
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef(
    Autoplay({
      delay: 4500,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = (await response.json()) as Service[];
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const shouldUseCarousel = services.length > 3;

  function renderServiceCard(service: Service) {
    return (
      <Card
        key={service.id}
        className="rounded-2xl border-slate-200 bg-white/85 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <CardHeader>
          <div className="mb-4 flex items-center justify-center text-blue-600">
            <ServiceIcon name={service.icon ?? ""} className="h-12 w-12" />
          </div>
          <CardTitle className="text-xl">{service.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {service.description}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to meet your needs
            </p>
          </Reveal>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="rounded-2xl border-slate-200 bg-white/85 text-center"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-lg bg-slate-100" />
                    <div className="mx-auto h-6 w-40 animate-pulse rounded bg-slate-100" />
                  </CardHeader>
                  <CardContent>
                    <div className="mx-auto h-4 w-full animate-pulse rounded bg-slate-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : shouldUseCarousel ? (
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[autoplayRef.current]}
              className="mx-12"
            >
              <CarouselContent>
                {services.map((service) => (
                  <CarouselItem
                    key={service.id}
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    {renderServiceCard(service)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={index * 0.06}>
                  {renderServiceCard(service)}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
