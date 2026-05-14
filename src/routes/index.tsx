import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Hero } from "@/components/Hero";
import {
  ServicesSection,
  CreatorRoster,
  BrandProcess,
  CreatorOnboarding,
  Testimonials,
  CTASection,
} from "@/components/LandingSections";
import { BrandForm } from "@/components/BrandForm";
import { CreatorForm } from "@/components/CreatorForm";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [brandOpen, setBrandOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />
      <main>
        <Hero onBrand={() => setBrandOpen(true)} onCreator={() => setCreatorOpen(true)} />
        <ServicesSection />
        <CreatorRoster />
        <BrandProcess />
        <CreatorOnboarding />
        <Testimonials />
        <CTASection onBrand={() => setBrandOpen(true)} onCreator={() => setCreatorOpen(true)} />
      </main>
      <SiteFooter />
      <BrandForm open={brandOpen} onOpenChange={setBrandOpen} />
      <CreatorForm open={creatorOpen} onOpenChange={setCreatorOpen} />
    </div>
  );
}
