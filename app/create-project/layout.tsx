"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Verification Banner */}
      <div className="bg-[#FFF8E1] border-b border-[#FFE082] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FFD54F] rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#F57F17]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span className="text-sm text-[#5D4037]">
              Please verify your email address to continue with project creation
            </span>
          </div>
          <button className="text-sm text-[#8BC34A] font-medium hover:underline">
            Resend verification
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
            Community Fundings
          </Link>
          <Link
            href="/"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Green Header Section with Stepper */}
      <div className="bg-gradient-to-b from-[#F5F9F0] to-white px-6 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          {currentStepIndex > 0 ? (
            <Link
              href={steps[currentStepIndex - 1].path}
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
              Back
            </Link>
          ) : (
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
              Back to Home
            </Link>
          )}

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {/* Step Circle */}
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
                    {/* Step Label */}
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
                  {/* Connector Line */}
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
