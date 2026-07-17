import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reveal } from "@/components/ui/reveal"

const specializations = [
  {
    title: "Internal Medicine",
    description: "Diagnosis and treatment for adult diseases with long-term care planning.",
  },
  {
    title: "Preventive Health",
    description: "Routine screenings and risk assessment to prevent illness early.",
  },
  {
    title: "Lifestyle Medicine",
    description: "Nutrition, sleep, and stress guidance for sustainable health outcomes.",
  },
  {
    title: "Teleconsultation",
    description: "Secure virtual follow-ups and convenient care from your home.",
  },
]

export function SpecializationsSection() {
  return (
    <section id="specializations" className="bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Specializations</Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Focused expertise for modern healthcare needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Specialized care pathways designed for accurate diagnosis, personalized treatment,
              and better long-term outcomes.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {specializations.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <Card className="h-full border-slate-200 bg-white/85 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <CardTitle className="mb-3 text-xl text-slate-900">{item.title}</CardTitle>
                    <p className="text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
