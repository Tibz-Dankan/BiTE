import React from "react";

export const MissionSection: React.FC = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To deliver world-class STEM education to high school students
              through inquiry-based learning grounded in Bitcoin—the world’s
              most reliable and transparent monetary system.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To empower a generation of self-sovereign thinkers who build
              transformative solutions in AI, robotics, and software—enabled by
              the long-term incentives and human-aligned ethos of Bitcoin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
