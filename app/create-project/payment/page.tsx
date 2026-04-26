"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  useCampaignDraft,
  saveDraftToBackend,
} from "@/app/create-project/store/useCampaignDraft";
import { photosPayloadForApi } from "@/app/create-project/lib/campaignPhotoUpload";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PaymentPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();

  const hasHydrated = useCampaignDraft((s) => s.hasHydrated);
  const setPayment = useCampaignDraft((s) => s.setPayment);

  const [contactEmail, setContactEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [accountType, setAccountType] = useState<"individual" | "business">(
    "individual",
  );
  const [accountHolderName, setAccountHolderName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [routingTouched, setRoutingTouched] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hydratedPaymentOnce = useRef(false);
  useEffect(() => {
    if (!hasHydrated || hydratedPaymentOnce.current) return;
    hydratedPaymentOnce.current = true;
    const p = useCampaignDraft.getState().draft.payment;
    setAccountType(p.account_type === "business" ? "business" : "individual");
    setAccountHolderName(p.account_holder_name);
    setRoutingNumber(p.routing_number.replace(/\D/g, "").slice(0, 9));
    setAccountNumber(p.account_number);
    setConfirmAccountNumber(p.confirm_account_number);
  }, [hasHydrated]);

  const routingValid = routingNumber.length === 9;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());
  const accountsMatch =
    accountNumber.length > 0 && confirmAccountNumber === accountNumber;

  const canSubmit = useMemo(() => {
    if (!userLoaded || !hasHydrated) return false;
    if (!user?.id) return false;
    return (
      emailVerified &&
      emailOk &&
      accountHolderName.trim().length > 0 &&
      routingValid &&
      accountNumber.length > 0 &&
      accountsMatch &&
      termsAccepted
    );
  }, [
    userLoaded,
    hasHydrated,
    user?.id,
    emailVerified,
    emailOk,
    accountHolderName,
    routingValid,
    accountNumber.length,
    accountsMatch,
    termsAccepted,
  ]);

  const handleVerifyEmail = () => {
    if (contactEmail && emailOk) {
      setEmailVerified(true);
    }
  };

  const handleSubmitForReview = async () => {
    if (!canSubmit || submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      setPayment({
        account_type: accountType,
        account_holder_name: accountHolderName.trim(),
        routing_number: routingNumber,
        account_number: accountNumber,
        confirm_account_number: confirmAccountNumber,
      });

      if (!user?.id) {
        throw new Error("You must be signed in to submit your campaign.");
      }

      await saveDraftToBackend(user);

      const { draft: d } = useCampaignDraft.getState();
      if (!d.campaign_id) {
        throw new Error("Could not save your draft. Please try again.");
      }

      const res = await fetch(`${API_URL}/api/campaigns/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_id: user.id,
          campaign_id: d.campaign_id,
          title: d.title,
          vanity_slug: d.vanity_slug,
          category: d.category,
          location: d.location,
          funding_goal_cents: d.funding_goal_cents,
          duration_days: d.duration_days,
          description_html: d.description_html,
          bio: d.bio,
          faqs: d.faqs,
          rewards: d.rewards,
          co_creators: d.co_creators,
          photos: photosPayloadForApi(d.photos),
          payment: {
            account_type: accountType,
            account_holder_name: accountHolderName.trim(),
            routing_number: routingNumber,
            account_number: accountNumber,
            contact_email: contactEmail.trim(),
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Submission failed");
      }

      router.push("/create-project/submitted");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Payment details
      </h1>
      <p className="text-gray-600 mb-8">
        Connect your Stripe account to receive funds from your campaign.
      </p>

      <div className="space-y-8">
        {/* Contact Email Section */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Contact Email
          </label>
          <p className="text-sm text-gray-500 mb-4">
            This email will be used for important notifications about your campaign and payments.
          </p>

          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    setEmailVerified(false);
                  }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>
              <button
                onClick={handleVerifyEmail}
                disabled={emailVerified}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  emailVerified
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-[#8BC34A] text-white hover:bg-[#7CB342]"
                }`}
              >
                {emailVerified ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Verified
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
            {emailVerified && (
              <p className="mt-3 text-sm text-green-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                A verification link has been sent to your email.
              </p>
            )}
          </div>
        </div>

        {/* Bank Account Section */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Bank Account
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Enter your bank details to receive funds. All information is securely encrypted.
          </p>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            {/* Account Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Account Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={accountType === "individual"}
                    onChange={(e) =>
                      setAccountType(e.target.value as "individual" | "business")
                    }
                    className="w-4 h-4 text-[#8BC34A] focus:ring-[#8BC34A]"
                  />
                  <span className="text-sm text-gray-700">Individual</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="business"
                    checked={accountType === "business"}
                    onChange={(e) =>
                      setAccountType(e.target.value as "individual" | "business")
                    }
                    className="w-4 h-4 text-[#8BC34A] focus:ring-[#8BC34A]"
                  />
                  <span className="text-sm text-gray-700">Business</span>
                </label>
              </div>
            </div>

            {/* Account Holder Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Enter name as it appears on account"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
              />
            </div>

            {/* Routing Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Routing Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  onBlur={() => setRoutingTouched(true)}
                  placeholder="9 digits"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent pr-12"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              {routingTouched && !routingValid && (
                <p className="mt-2 text-sm text-red-500">
                  Routing number must be exactly 9 digits.
                </p>
              )}
            </div>

            {/* Account Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Number
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent pr-12"
                />
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Account Number
              </label>
              <input
                type="password"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Re-enter account number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent ${
                  confirmAccountNumber && confirmAccountNumber !== accountNumber
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {confirmAccountNumber && confirmAccountNumber !== accountNumber && (
                <p className="mt-2 text-sm text-red-500">
                  Account numbers do not match
                </p>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 flex items-start gap-3 text-sm text-gray-500">
            <svg
              className="w-5 h-5 text-[#8BC34A] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p>
              Your bank information is encrypted and stored securely. We use industry-standard security measures to protect your data.
            </p>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="border border-gray-200 rounded-lg p-6 bg-[#F5F9F0]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-[#8BC34A] rounded focus:ring-[#8BC34A]"
            />
            <span className="text-sm text-gray-700">
              I agree to the{" "}
              <Link href="#" className="text-[#8BC34A] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#8BC34A] hover:underline">
                Creator Agreement
              </Link>
              . I understand that Community Fundings will collect a 5% platform fee and payment processing fees from successfully funded projects.
            </span>
          </label>
        </div>
      </div>

      {submitError && (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      {/* Submit Button */}
      <div className="mt-12 flex justify-between items-center gap-4 flex-wrap">
        <Link
          href="/create-project/people"
          className="text-gray-500 px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Back
        </Link>
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmitForReview}
          title={
            !canSubmit && userLoaded && hasHydrated
              ? "Complete email verification, bank details, and accept the terms to submit."
              : undefined
          }
          className={`px-8 py-3 rounded-full font-medium transition-colors ${
            !canSubmit || submitting
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#8BC34A] text-white hover:bg-[#7CB342]"
          }`}
        >
          {submitting ? "Submitting…" : "Submit for Review"}
        </button>
      </div>
    </div>
  );
}