import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Eligibility from "@/components/Eligibility";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="flex-1 w-full overflow-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Eligibility />
      <Testimonials />
      <CTA />
    </main>
  );
}
