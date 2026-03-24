"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCampaignDraft } from "./store/useCampaignDraft";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const steps = [
  { number: "01", label: "Basics", path: "/create-project/basics" },
  { number: "02", label: "Rewards", path: "/create-project/rewards" },
  { number: "03", label: "Story", path: "/create-project/story" },
  { number: "04", label: "People", path: "/create-project/people" },
  { number: "05", label: "Payments Details", path: "/create-project/payment" },
];

export default function CreateProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const reset = useCampaignDraft((s) => s.reset);
  const loadDraft = useCampaignDraft((s) => s.loadDraft);
  const hasHydrated = useCampaignDraft((s) => s.hasHydrated);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (didInitRef.current) return;
    didInitRef.current = true;

    const draftId = searchParams.get("draft");
    if (draftId) {
      // Load existing draft from DB
      const token = localStorage.getItem("cf_backend_token");
      if (token) {
        fetch(`${API_URL}/api/campaigns/drafts/${draftId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) loadDraft(data);
          })
          .catch((err) => console.error("Failed to load draft:", err));
      }
    } else {
      // Fresh campaign — reset store
      reset();
    }
  }, [hasHydrated, reset, loadDraft, searchParams]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // triggers native confirm dialog (Cancel / Leave)
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
            Community Fundings
          </Link>
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full cursor-pointer"
            />
          ) : (
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
      </header>

      {/* Green Header Section with Stepper */}
      <div className="bg-gradient-to-b from-[#F5F9F0] to-white px-6 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home Page
          </Link>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        status === "completed"
                          ? "bg-[#8BC34A] text-white"
                          : status === "current"
                          ? "bg-[#8BC34A] text-white"
                          : "border-2 border-gray-300 text-gray-400"
                      }`}
                    >
                      {status === "completed" ? (
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
                      ) : (
                        step.number
                      )}
                    </div>

                    <span
                      className={`mt-2 text-xs font-medium ${
                        status === "completed" || status === "current"
                          ? "text-[#8BC34A]"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block w-16 h-0.5 mx-4 ${
                        status === "completed" ? "bg-[#8BC34A]" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}