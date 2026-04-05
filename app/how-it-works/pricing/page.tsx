"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// ─── Update pricing values here at any time ───────────────────────────────────
const PRICING = {
  individual: {
    platformFee: 3,       // percentage of funds raised
    monthlyFee: 0,        // USD/month (0 = free)
  },
  businessPro: {
    platformFee: 3.5,     // percentage of funds raised
    monthlyFee: 49,       // USD/month
  },
};
// ──────────────────────────────────────────────────────────────────────────────

const individualFeatures = [
  "Personal fundraising campaigns",
  "Single-user account",
  "Identity verification",
  "Stripe-powered payments",
  "Campaign analytics dashboard",
  "Email support",
];

const businessProFeatures = [
  "Everything in Individual",
  "Business entity campaigns",
  "Verified Business badge",
  "Team roles & permissions",
  "Role-based access control",
  "Compliance & audit tools",
  "Priority support",
];

export default function PricingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F5F5] py-14">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/how-it-works"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors border border-gray-300 rounded-full px-4 py-2 bg-white mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            How It Works
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Pricing
          </h1>
          <p className="text-gray-600 max-w-xl">
            Simple, transparent pricing for individuals and businesses. No hidden fees — just a
            straightforward platform fee on the funds you raise.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">

          {/* Individual */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col">
            <p className="text-sm font-medium text-[#8BC34A] uppercase tracking-widest mb-3">
              Individual
            </p>
            <div className="mb-6">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">Free</span>
                <span className="text-gray-500 text-sm mb-1">to start</span>
              </div>
              <p className="text-sm text-gray-500">
                + {PRICING.individual.platformFee}% platform fee on funds raised
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {individualFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-[#8BC34A] flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={user ? "/settings" : "/sign-up"}
              className="block w-full text-center border border-[#8BC34A] text-[#8BC34A] py-3 rounded-full font-medium hover:bg-[#8BC34A] hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Business Pro */}
          <div className="bg-[#8BC34A] rounded-2xl shadow-lg p-8 relative flex flex-col">
            <div className="absolute top-5 right-5">
            </div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-widest mb-3">
              Business Pro
            </p>
            <div className="mb-6">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-white">
                  ${PRICING.businessPro.monthlyFee}
                </span>
                <span className="text-white/80 text-sm mb-1">/month</span>
              </div>
              <p className="text-sm text-white/80">
                + {PRICING.businessPro.platformFee}% platform fee on funds raised
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {businessProFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-white/90">
                  <svg
                    className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={user ? "/settings" : "/sign-up"}
              className="block w-full text-center bg-white text-[#8BC34A] py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </div>

        </div>

        {/* Donor Pricing */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#8BC34A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#8BC34A] uppercase tracking-widest">For Donors</p>
                <p className="text-xl font-bold text-gray-900">Always Free to Give</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Donating on Community Fundings is completely free. Donors are never charged a platform fee,
              percentage, or transaction fee of any kind. Every dollar you give goes directly to the campaign.
            </p>
          </div>
        </div>

        {/* Create Campaign CTA */}
        <div className="max-w-3xl mx-auto bg-[#8BC34A] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">
            Ready to Start a Campaign?
          </h2>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Create your campaign today and start raising funds for what matters most.
          </p>
          <Link
            href={user ? "/create-project/basics" : "/sign-up"}
            className="bg-white text-[#8BC34A] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Create a Campaign
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}