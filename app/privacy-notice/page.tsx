import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyNoticePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#F5F5F5] py-14">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/about-us"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors border border-gray-300 rounded-full px-4 py-2 bg-white mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Privacy Notice
          </h1>
          <p className="text-gray-500 text-sm">Last updated: coming soon</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
          <p className="text-lg font-medium text-gray-700 mb-2">Content coming soon</p>
          <p className="text-sm">Our full Privacy Notice will be published here shortly.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}