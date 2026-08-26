import { Zap, Shield, BarChart3, Users, Globe, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Feature One",
    description: "Short description of the feature and its benefit to the user.",
  },
  {
    icon: Shield,
    title: "Feature Two",
    description: "Short description of the feature and its benefit to the user.",
  },
  {
    icon: BarChart3,
    title: "Feature Three",
    description: "Short description of the feature and its benefit to the user.",
  },
  {
    icon: Users,
    title: "Feature Four",
    description: "Short description of the feature and its benefit to the user.",
  },
  {
    icon: Globe,
    title: "Feature Five",
    description: "Short description of the feature and its benefit to the user.",
  },
  {
    icon: Sparkles,
    title: "Feature Six",
    description: "Short description of the feature and its benefit to the user.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A brief description of the feature set and how it helps users accomplish their goals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
