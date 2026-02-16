import React from "react";
import { LandingNavbar } from "../landing/LandingNavbar";
import { Footer } from "../landing/Footer";
import {
  Gift,
  Zap,
  Download,
  UserPlus,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
} from "lucide-react";
import { SCNButton } from "../../../ui/shared/button";
import { Link, Navigate } from "react-router-dom";
import { useFeatureFlagEnabled } from "@posthog/react";

export const RewardsInfoPage: React.FC = () => {
  const isSatsRewardEnabled = useFeatureFlagEnabled("sats-reward");

  if (isSatsRewardEnabled === false) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[oklch(0.749_0.154_70.67)] selection:text-white pt-16">
      <LandingNavbar />

      <main>
        {/* Header Section */}
        <section className="py-20 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-6">
              <Gift size={16} />
              <span>BiTE Rewards Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Learn STEM, Earn{" "}
              <span className="text-[oklch(0.749_0.154_70.67)]">Bitcoin</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Our unique incentive model rewards students for mastery in
              science, technology, engineering, and mathematics.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <div className="w-20 h-1.5 bg-purple-600 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto font-black text-2xl">
                  1
                </div>
                <h3 className="text-xl font-bold">Complete Quizzes</h3>
                <p className="text-gray-600 text-sm">
                  Attempt curriculum modules in STEM, AI, and Robotics. Every
                  correct answer contributes to your score.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto font-black text-2xl">
                  2
                </div>
                <h3 className="text-xl font-bold">Accumulate SATS</h3>
                <p className="text-gray-600 text-sm">
                  The higher you score, the more sats are credited your account.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto font-black text-2xl">
                  3
                </div>
                <h3 className="text-xl font-bold">Instant Payout</h3>
                <p className="text-gray-600 text-sm">
                  Link your lightning address and claim your sats. They are sent
                  instantly to your wallet via the Lightning Network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blink Integration Guide */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
            <Zap size={400} />
          </div>

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4">
                  <img
                    src="/images/blink-logo.png"
                    alt="Blink Logo"
                    className="w-16 h-16 rounded-2xl shadow-xl border-2 border-slate-700"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">
                      Lightning Rewards via Blink
                    </h2>
                    <p className="text-slate-400">
                      Our preferred lightning address provider
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <Download size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        1. Get the Blink App
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Download the Blink wallet from the App Store or Google
                        Play and create your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <UserPlus size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        2. Find Your Lightning Address
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Go to your profile in Blink. Your address looks like{" "}
                        <span className="text-white font-mono">
                          username@blink.sv
                        </span>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <LinkIcon size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">3. Link to BiTE</h4>
                      <p className="text-slate-400 text-sm">
                        Log in to BiTE, go to{" "}
                        <strong>Rewards &gt; Addresses</strong>, and add your
                        Blink address.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <SCNButton
                    asChild
                    className="rounded-full px-8 bg-white text-slate-900 hover:bg-slate-100"
                  >
                    <a
                      href="https://www.blink.sv/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Blink Wallet
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </SCNButton>
                </div>
              </div>

              <div className="flex-1 hidden md:block">
                <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl rotate-3">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Setup Instructions
                      </span>
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <div className="h-4 bg-slate-700 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-700 rounded-full w-1/2" />
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700 border-dashed">
                      <p className="text-xs text-slate-500 mb-2">
                        Input your address:
                      </p>
                      <p className="font-mono text-purple-400">
                        yourname@blink.sv
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <ShieldCheck size={18} />
                      <span>Verified & Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / Info */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-purple-50 rounded-3xl p-8 md:p-12 border border-purple-100">
              <div className="flex items-center gap-4 mb-8">
                <Info size={32} className="text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Important Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                    <p>
                      Rewards are currently paid out in Satoshis (Sats) via the
                      Lightning Network.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                    <p>
                      Satoshi are rewarded based on the amount of correct
                      questions.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                    <p>
                      Rewards are instantly wired to lightning address upon quiz
                      completion.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                    <p>
                      Currently, Blink is our primarily supported and
                      recommended wallet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <SCNButton
                  asChild
                  size="lg"
                  className="rounded-full px-10 shadow-lg shadow-purple-200"
                >
                  <Link to="/auth/signup">Join Bitcoin High School Today</Link>
                </SCNButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
