import React from "react";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { MissionSection } from "./landing/MissionSection";
import { Footer } from "./landing/Footer";
import { CurriculumPreviewSection } from "./landing/CurriculumPreviewSection";
import { LandingNavbar } from "./landing/LandingNavbar";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />
      <HeroSection />
      <CurriculumPreviewSection />
      <FeaturesSection />
      <MissionSection />
      <Footer />
    </div>
  );
};
