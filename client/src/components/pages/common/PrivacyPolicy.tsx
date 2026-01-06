import React from "react";
import { LandingNavbar } from "./landing/LandingNavbar";
import { Footer } from "./landing/Footer";

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated: string = "2026-01-04T15:30:45.123+03:00";

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />

      <main className="container mx-auto px-4 max-w-4xl py-12 md:py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              Welcome to Bitcoin High School (BiTE). We respect your privacy and
              are committed to protecting your personal data. This privacy
              policy will inform you as to how we look after your personal data
              when you visit our website and sign up for our educational
              services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. The Data We Collect
            </h2>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Identity Data:</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address.
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP)
                address, browser type and version, time zone setting and
                location, browser plug-in types and versions, operating system
                and platform on the devices you use to access this website.
              </li>
              <li>
                <strong>Usage Data:</strong> includes information about how you
                use our website, products and services (e.g., quiz progress,
                module completion).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Personal Data
            </h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To register you as a new student.</li>
              <li>
                To deliver educational content and track your progress in the
                curriculum.
              </li>
              <li>
                To manage our relationship with you, including notifying you
                about changes to our terms or privacy policy.
              </li>
              <li>
                To improve our website, products/services, marketing and student
                relationships.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Legal Rights
            </h2>
            <p>
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to
              request access, correction, erasure, restriction, transfer, to
              object to processing, to portability of data and (where the lawful
              ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us through the integrated support
              channels on the dashboard.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
