import React from "react";
import { SCNButton } from "../../../ui/shared/button";
import { Gift, Zap, ArrowRight, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

export const RewardsSection: React.FC = () => {
  return (
    <section id="rewards" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 
        w-[500px] h-[500px] bg-orange-50 rounded-full blur-[120px] 
        -z-10 opacity-60"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div
              className="absolute -top-10 -left-10 w-32 h-32 bg-purple-50
              rounded-full blur-3xl -z-10 animate-pulse"
            />

            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                bg-orange-50 text-orange-600 text-sm font-semibold border
                border-orange-100"
              >
                <Zap size={14} className="fill-orange-600" />
                <span>Learn to Earn</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Earn Real{" "}
                <span className="text-[oklch(0.749_0.154_70.67)]">Satoshi</span>{" "}
                Rewards
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                At Bitcoin High School, we believe knowledge is valuable.
                Complete our STEM, AI, and Robotics quizzes to earn Bitcoin
                rewards delivered straight to your lightning address.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600 mt-1">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Proof of Knowledge
                    </h4>
                    <p className="text-gray-600">
                      The higher you score, the more sats are credited your
                      account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Instant Payouts</h4>
                    <p className="text-gray-600">
                      Link your lightning address and claim your rewards
                      anytime, anywhere.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <SCNButton
                  asChild
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-purple-100"
                >
                  <Link to="/auth/signup">Start Earning Now</Link>
                </SCNButton>
                <SCNButton
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 border-gray-200"
                >
                  <Link to="/rewards">
                    How it Works
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </SCNButton>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl
               border border-gray-100 shadow-xl shadow-slate-100/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-600 rounded-2xl text-white">
                    <Gift size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Reward Balance
                    </h3>
                    <p className="text-sm text-gray-500">
                      Auto-payouts enabled
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">
                    1,250
                  </span>
                  <p className="text-xs font-bold text-orange-600 tracking-wider">
                    SATS
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  className="p-4 bg-white rounded-2xl border border-gray-50 flex
                  items-center justify-between group hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/blink-logo.png"
                      alt="Blink"
                      className="w-10 h-10 rounded-xl"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Blink Wallet
                      </p>
                      <p className="text-xs text-gray-500">Primary Provider</p>
                    </div>
                  </div>
                  <div
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs
                    font-bold"
                  >
                    Connected
                  </div>
                </div>

                <div
                  className="p-6 bg-slate-900 rounded-2xl text-white overflow-hidden
                  relative group"
                >
                  <div
                    className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110
                   transition-transform"
                  >
                    <Zap size={80} />
                  </div>
                  <p className="text-sm font-medium opacity-70 mb-1">
                    Recent Activity
                  </p>
                  <p className="font-bold">STEM Quiz Mastery</p>
                  <div className="flex items-end justify-between mt-4">
                    <p className="text-2xl font-bold">
                      +500{" "}
                      <span className="text-xs opacity-60 uppercase">sats</span>
                    </p>
                    <p className="text-xs opacity-60">2 mins ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floaties */}
            <div
              className="absolute -bottom-6 -right-6 p-4 bg-white rounded-2xl
              shadow-lg border border-gray-100 animate-float"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 bg-orange-100 rounded-full flex items-center
                  justify-center text-orange-600"
                >
                  <Zap size={16} className="fill-orange-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  Claim Success!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
