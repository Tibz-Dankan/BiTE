import React from "react";
import { LandingNavbar } from "./landing/LandingNavbar";
import { Footer } from "./landing/Footer";

export const TermsOfService: React.FC = () => {
  const lastUpdated: string = "2026-01-04T15:30:45.123+03:00";

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />

      <main className="container mx-auto px-4 max-w-4xl py-12 md:py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-lg prose-gray max-w-none text-gray-600">
          <p className="mb-6">
            Last updated:{" "}
            {new Date(lastUpdated).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Bitcoin High School (BiTE), you accept and
              agree to be bound by the terms and provision of this agreement. In
              addition, when using these particular services, you shall be
              subject to any posted guidelines or rules applicable to such
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Educational Content Disclaimer
            </h2>
            <p>
              BiTE provides educational content focused on STEM subjects,
              economics, and Bitcoin.{" "}
              <strong>
                This content is for educational purposes only and does not
                constitute financial, investment, or legal advice.
              </strong>{" "}
              You should not treat any opinion expressed on this platform as a
              specific inducement to make a particular investment or follow a
              particular strategy, but only as an expression of an opinion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Conduct
            </h2>
            <p>
              You agree to use the website only for lawful purposes. You agree
              not to take any action that might compromise the security of the
              website, render the website inaccessible to others or otherwise
              cause damage to the website or the Content. You agree not to add
              to, subtract from, or otherwise modify the Content, or to attempt
              to access any Content that is not intended for you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Intellectual Property
            </h2>
            <p>
              All materials displayed or performed on the Site, including, but
              not limited to text, graphics, logos, tools, photographs, images,
              illustrations, software or source code, audio and video, and
              animations (collectively, "Content") are the property of Bitcoin
              High School and/or third parties and are protected by
              international copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Termination
            </h2>
            <p>
              We may terminate or suspend access to our Service immediately,
              without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. What constitutes a material change will
              be determined at our sole discretion.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
