import React from "react";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { MissionSection } from "./landing/MissionSection";
import { Footer } from "./landing/Footer";
import { CurriculumPreviewSection } from "./landing/CurriculumPreviewSection";
import { RewardsSection } from "./landing/RewardsSection";
import { LandingNavbar } from "./landing/LandingNavbar";
import { useLocation } from "react-router-dom";
import { useFeatureFlagEnabled } from "@posthog/react";

export const LandingPage: React.FC = () => {
  const location = useLocation();
  const isSatsRewardEnabled = useFeatureFlagEnabled("sats-reward");

  React.useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />
      <HeroSection />
      <CurriculumPreviewSection />
      {isSatsRewardEnabled && <RewardsSection />}
      <FeaturesSection />
      <MissionSection />
      <Footer />
    </div>
  );
};
