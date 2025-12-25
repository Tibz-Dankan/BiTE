import React from "react";
import {
  Compass,
  ShieldCheck,
  Terminal,
  Infinity as InfinityIcon,
} from "lucide-react";

const features = [
  {
    title: "Inquiry-Based Learning",
    description:
      "Students learn by answering questions, exploring real-world problems, and discovering solutions through curiosity.",
    icon: Compass,
    className: "md:col-span-2",
  },
  {
    title: "Bitcoin Ethos",
    description:
      "Grounded in transparency, low time preference, and self-sovereignty.",
    icon: ShieldCheck,
    className: "md:col-span-1",
  },
  {
    title: "Real-World Skills",
    description:
      "Hands-on experience with AI, Robotics, and Software development.",
    icon: Terminal,
    className: "md:col-span-1",
  },
  {
    title: "Long-Term Thinking",
    description: "Building for generations, not just the next quarter.",
    icon: InfinityIcon,
    className: "md:col-span-2",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            More Than Just Coding.
          </h2>
          <p className="text-lg text-gray-600">
            We are shaping the character and capability of the next generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${feature.className}`}
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.749_0.154_70.67/0.1)] text-[oklch(0.749_0.154_70.67)]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.749_0.154_70.67/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
