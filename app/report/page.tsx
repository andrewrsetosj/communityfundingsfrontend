"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ReportPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [reportDescription, setReportDescription] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportedContentUrl, setReportedContentUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function isValidOptionalUrl(value: string) {
    if (!value.trim()) return true;

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!reportDescription.trim()) {
      setErrorMessage('Please fill out "Describe what you are reporting."');
      return;
    }

    if (!reportReason.trim()) {
      setErrorMessage('Please fill out "Why are you reporting this?"');
      return;
    }

    if (!isValidOptionalUrl(reportedContentUrl)) {
      setErrorMessage("Please enter a valid URL for the reported content, or leave it blank.");
      return;
    }

    const token = localStorage.getItem("cf_backend_token");
    if (!token || token === "undefined" || token === "null") {
      setErrorMessage("You must be signed in to submit a report.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/misc-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_description: reportDescription.trim(),
          report_reason: reportReason.trim(),
          reported_content_url: reportedContentUrl.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to submit report");
      }

      setSuccessMessage("Thanks — your report has been submitted.");
      setReportDescription("");
      setReportReason("");
      setReportedContentUrl("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center text-gray-500">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Report Something</h1>
          <p className="text-gray-600 mt-3 leading-7">
            If you&apos;d like to report a specific profile, campaign, or comment, you can
            report in one click with the &quot;Report&quot; button on all profiles, campaigns,
            and comments.
          </p>
          <p className="text-gray-600 mt-2 leading-7">
            Use this page for anything else you&apos;d like us to review.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="report_description"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Describe what you are reporting <span className="text-red-500">*</span>
              </label>
              <textarea
                id="report_description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={5}
                maxLength={5000}
                placeholder="Describe the issue clearly and include any important context."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-[#8BC34A] resize-y"
                required
              />
            </div>

            <div>
              <label
                htmlFor="report_reason"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Why are you reporting this? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="report_reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                maxLength={3000}
                placeholder="Tell us why this should be reviewed."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-[#8BC34A] resize-y"
                required
              />
            </div>

            <div>
              <label
                htmlFor="reported_content_url"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Link to media or content being reported
                <span className="text-gray-400 ml-1">(optional)</span>
              </label>
              <input
                id="reported_content_url"
                type="url"
                value={reportedContentUrl}
                onChange={(e) => setReportedContentUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-[#8BC34A]"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            ) : null}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-[#8BC34A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#7CB342] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}