import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyNoticePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F9F0] py-16 px-6 border-b border-[#8BC34A]/20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#8BC34A]/10 text-[#8BC34A] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            Privacy Notice
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Your Privacy Matters to Us
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            As a Nevada Benefit Corporation, we are committed to protecting your data while pursuing our mission of bringing creative projects to life.
          </p>
          <p className="text-sm text-gray-400">Effective Date: February 22, 2026 · Last Updated: February 22, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* 1 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            We collect only what we need to run the platform and fulfill our mission. Here is exactly what we gather:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Identifiers", desc: "Name, email address, phone number, and physical address." },
              { label: "Financial Information", desc: "Payment details processed securely via Stripe. We never store your full card number." },
              { label: "Creative Data", desc: "Projects you organize or back, and your expressed creative interests." },
              { label: "Technical Data", desc: "IP address, browser type, and usage patterns collected via cookies." },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
                <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            {[
              "Facilitate crowdfunding campaigns and reward fulfillment between Organizers and Backers.",
              "Verify the identity of Campaign Organizers to prevent fraud.",
              "Communicate platform updates, campaign activity, and support responses.",
              "Benefit Reporting: We use aggregated, non-identifiable data to measure our social impact — for example, how many campaigns from underrepresented zip codes we helped fund each year. This is required by our Benefit Corporation status.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
            <h2 className="text-xl font-bold text-gray-900">Sharing Your Information</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 text-sm text-amber-800">
            <strong>We do not sell your personal information for monetary consideration.</strong>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">We share data only in these specific situations:</p>
          <div className="space-y-4">
            {[
              { who: "Campaign Organizers", what: "If you back a project, your name, email, and shipping address are shared with the Organizer so they can deliver your rewards." },
              { who: "Service Providers", what: "Companies that help us run our platform — cloud hosting, payment processing, and email delivery." },
              { who: "Legal Compliance", what: "When required by Nevada or Federal law, or to protect the safety of our community." },
            ].map(({ who, what }) => (
              <div key={who} className="flex gap-4 items-start border-b border-gray-100 pb-4">
                <p className="text-sm font-semibold text-gray-900 w-40 shrink-0">{who}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{what}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
            <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { region: "Nevada (SB 220)", detail: "You have the right to opt out of the sale of your covered information. Email us at privacy@communityfundings.com with the subject line \"Nevada Opt-Out Request.\"" },
              { region: "California (CCPA/CPRA)", detail: "California residents may request access, deletion, or portability of their personal data." },
              { region: "Europe (GDPR)", detail: "EU residents have the right to access, correct, delete, or port their personal data." },
              { region: "All Users", detail: "You may review or update your information at any time in your Account Settings." },
            ].map(({ region, detail }) => (
              <div key={region} className="border border-gray-200 rounded-xl p-5">
                <p className="font-semibold text-gray-900 text-sm mb-1">{region}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            To exercise any of these rights, contact our Privacy Team at{" "}
            <a href="mailto:privacy@communityfundings.com" className="text-[#8BC34A] hover:underline">
              privacy@communityfundings.com
            </a>.
          </p>
        </div>

        {/* 5 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">5</div>
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We use industry-standard SSL/TLS encryption and follow Nevada&apos;s data security requirements (NRS 603A.210) to protect your information from unauthorized access, alteration, disclosure, or destruction. Your payment information is handled exclusively by our PCI-compliant payment processor and never stored on our servers.
          </p>
        </div>

        {/* 6 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] text-white flex items-center justify-center text-sm font-bold shrink-0">6</div>
            <h2 className="text-xl font-bold text-gray-900">Changes to This Policy</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            If we make material changes to how we handle your data, we will notify you by posting a prominent notice on our homepage and sending an email to the address associated with your account. Your continued use of the platform after receiving notice constitutes your acceptance of the updated policy.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-2">Questions about your privacy?</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Our Privacy Team is here to help. Reach out at any time:
          </p>
          <a href="mailto:privacy@communityfundings.com" className="text-[#8BC34A] font-medium hover:underline text-sm">
            privacy@communityfundings.com
          </a>
        </div>

      </section>

      <Footer />
    </div>
  );
}
