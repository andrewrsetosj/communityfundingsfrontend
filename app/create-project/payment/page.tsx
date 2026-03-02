"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCampaignDraft } from "../store/useCampaignDraft";
import { DraftDebug } from "@/app/create-project/component/draftDebug";

export default function PaymentPage() {
  const router = useRouter();

  // Store-backed payment draft
  const payment = useCampaignDraft((s) => s.draft.payment);
  const setPayment = useCampaignDraft((s) => s.setPayment);

  // Local-only UI state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ✅ touched flags (show validation UI only after interaction)
  const [typeTouched, setTypeTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [routingTouched, setRoutingTouched] = useState(false);
  const [accountTouched, setAccountTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // ✅ Validation
  const accountTypeValid =
    payment.account_type === "individual" || payment.account_type === "business";

  const nameValid = (payment.account_holder_name ?? "").trim().length > 0;

  const routingValid = (payment.routing_number ?? "").trim().length === 9;

  // account numbers vary a lot; just require some reasonable minimum
  const accountValid = (payment.account_number ?? "").trim().length >= 4;

  const confirmPresent = (payment.confirm_account_number ?? "").trim().length > 0;
  const confirmMatches =
    (payment.confirm_account_number ?? "") === (payment.account_number ?? "");
  const confirmValid = confirmPresent && confirmMatches;

  const canSubmit =
    agreedToTerms &&
    accountTypeValid &&
    nameValid &&
    routingValid &&
    accountValid &&
    confirmValid;

  const handleSubmitForReview = () => {
    // mark touched so errors show if they try to submit
    setTypeTouched(true);
    setNameTouched(true);
    setRoutingTouched(true);
    setAccountTouched(true);
    setConfirmTouched(true);

    if (!canSubmit) return;

    router.push("/create-project/submitted");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Payment details
      </h1>
      <p className="text-gray-600 mb-8">
        Set up how you&apos;ll receive funds from your campaign.
      </p>

      <div className="space-y-8">
        {/* Bank Account Section */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Bank Account
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Enter your bank details to receive funds. All information is securely
            encrypted.
          </p>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            {/* Account Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Account Type{" "}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="individual"
                    checked={payment.account_type === "individual"}
                    onChange={() => {
                      setPayment({ account_type: "individual" });
                      setTypeTouched(true);
                    }}
                    onBlur={() => setTypeTouched(true)}
                    className="w-4 h-4 text-[#8BC34A] focus:ring-[#8BC34A]"
                  />
                  <span className="text-sm text-gray-700">Individual</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="business"
                    checked={payment.account_type === "business"}
                    onChange={() => {
                      setPayment({ account_type: "business" });
                      setTypeTouched(true);
                    }}
                    onBlur={() => setTypeTouched(true)}
                    className="w-4 h-4 text-[#8BC34A] focus:ring-[#8BC34A]"
                  />
                  <span className="text-sm text-gray-700">Business</span>
                </label>
              </div>

              {typeTouched && !accountTypeValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please select an account type.
                </p>
              )}
            </div>

            {/* Account Holder Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Holder Name{" "}
              </label>
              <input
                type="text"
                value={payment.account_holder_name}
                onChange={(e) => setPayment({ account_holder_name: e.target.value })}
                onBlur={() => setNameTouched(true)}
                placeholder="Enter name as it appears on account"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent ${
                  nameTouched && !nameValid ? "border-red-300" : "border-gray-300"
                }`}
              />
              {nameTouched && !nameValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please enter the account holder name.
                </p>
              )}
            </div>

            {/* Routing Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Routing Number{" "}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={payment.routing_number}
                  onChange={(e) =>
                    setPayment({
                      routing_number: e.target.value.replace(/\D/g, "").slice(0, 9),
                    })
                  }
                  onBlur={() => setRoutingTouched(true)}
                  placeholder="9 digits"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent pr-12 ${
                    routingTouched && !routingValid ? "border-red-300" : "border-gray-300"
                  }`}
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
                Account Number{" "}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={payment.account_number}
                  onChange={(e) =>
                    setPayment({ account_number: e.target.value.replace(/\D/g, "") })
                  }
                  onBlur={() => setAccountTouched(true)}
                  placeholder="Enter account number"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent pr-12 ${
                    accountTouched && !accountValid ? "border-red-300" : "border-gray-300"
                  }`}
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
              {accountTouched && !accountValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please enter an account number.
                </p>
              )}
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Account Number{" "}
              </label>
              <input
                type="password"
                value={payment.confirm_account_number}
                onChange={(e) =>
                  setPayment({ confirm_account_number: e.target.value.replace(/\D/g, "") })
                }
                onBlur={() => setConfirmTouched(true)}
                placeholder="Re-enter account number"
                inputMode="numeric"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent ${
                  confirmTouched && !confirmValid ? "border-red-300" : "border-gray-300"
                }`}
              />

              {confirmTouched && !confirmPresent && (
                <p className="mt-2 text-sm text-red-500">
                  Please re-enter your account number.
                </p>
              )}

              {confirmTouched && confirmPresent && !confirmMatches && (
                <p className="mt-2 text-sm text-red-500">
                  Account numbers do not match.
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
              Your bank information is encrypted and stored securely. We use
              industry-standard security measures to protect your data.
            </p>
          </div>
        </div>

        {/* Terms Agreement + Footer */}
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg bg-[#F3FAEE] p-6">
            <label className="flex items-start gap-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
              />
              <span className="text-gray-800">
                I agree to the{" "}
                <Link href="/terms" className="text-[#8BC34A] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/creator-agreement"
                  className="text-[#8BC34A] hover:underline"
                >
                  Creator Agreement
                </Link>
                . I understand that Community Fundings will collect a 5% platform
                fee and payment processing fees from successfully funded projects.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={!canSubmit}
              className="
                bg-[#8BC34A] text-white
                px-10 py-3
                rounded-full font-medium
                whitespace-nowrap
                hover:bg-[#7CB342]
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:bg-[#8BC34A]
              "
              title={!canSubmit ? "Please complete all payment fields and agree to the terms." : undefined}
            >
              Submit for Review
            </button>
          </div>
        </div>

        <DraftDebug />
      </div>
    </div>
  );
}