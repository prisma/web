import type { Metadata } from "next";
import { AgentLoop } from "@/components/sections/agent-loop";
import { HeroHome } from "@/components/sections/hero-home";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { StackBento } from "@/components/sections/stack-bento";
import { Comparison } from "@/components/sections/comparison";
import { HowItWorks } from "@/components/sections/how-it-works";
import { TestimonialsReveal } from "@/components/sections/testimonials-reveal";
import { PricingScale } from "@/components/sections/pricing-scale";
import { Faq } from "@/components/sections/faq";
import { CtaBurst } from "@/components/sections/cta-burst";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="playtime-home">
      <HeroHome />
      <div className="playtime-chapter" data-playtime-section="friends">
        <LogoCloud />
      </div>
      <div className="playtime-chapter" data-playtime-section="comparison">
        <Comparison />
      </div>
      <div className="playtime-chapter" data-playtime-section="steps">
        <HowItWorks />
      </div>
      <div className="playtime-chapter" data-playtime-section="stack">
        <StackBento />
      </div>
      <div className="playtime-chapter" data-playtime-section="agent">
        <AgentLoop />
      </div>
      <div className="playtime-chapter" data-playtime-section="pricing">
        <PricingScale />
      </div>
      <div className="playtime-chapter" data-playtime-section="testimonials">
        <TestimonialsReveal />
      </div>
      <div className="playtime-chapter" data-playtime-section="faq">
        <Faq />
      </div>
      <div className="playtime-chapter" data-playtime-section="cta">
        <CtaBurst />
      </div>
    </div>
  );
}
