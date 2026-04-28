import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F9F0] py-16 px-6 border-b border-[#8BC34A]/20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#8BC34A]/10 text-[#8BC34A] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            Trust &amp; Safety
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Our Commitment to the Community
          </h1>
          <p className="text-gray-600 text-lg">
            Our success is measured by the creative projects we help bring to life — not just our bottom line. As a Nevada Benefit Corporation, we are legally committed to maintaining a safe, transparent, and equitable platform.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* 1 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">How We Vet Projects</h2>
              <p className="text-gray-500 text-sm">Every project undergoes a review before going live</p>
            </div>
          </div>
          <div className="pl-14 space-y-4">
            {[
              { title: "Identity Verification", desc: "We use industry-leading tools to verify the identity of every Campaign Organizer before their project goes live." },
              { title: "Mission Alignment", desc: "We ensure every project aligns with our Charter. We do not host projects that promote hate, discrimination, or illegal activities." },
              { title: "Feasibility Check", desc: "While we don't guarantee success, we look for clear plans and realistic goals to ensure backers are supporting viable ideas." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Financial Security</h2>
              <p className="text-gray-500 text-sm">Your money is handled with the highest level of care</p>
            </div>
          </div>
          <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">Secure Processing</p>
              <p className="text-gray-600 text-sm leading-relaxed">We partner with world-class payment processors like Stripe. Your full credit card information never touches our servers.</p>
            </div>
            <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">All-or-Nothing Model</p>
              <p className="text-gray-600 text-sm leading-relaxed">If a project doesn&apos;t reach its goal by the deadline, backers are not charged. Your money only goes to projects with enough budget to succeed.</p>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Transparency &amp; Communication</h2>
              <p className="text-gray-500 text-sm">The "Community" in our name is there for a reason</p>
            </div>
          </div>
          <div className="pl-14 space-y-4">
            {[
              { title: "Mandatory Updates", desc: "We require Organizers to post project updates at least once every 30 days if a project is delayed or ongoing." },
              { title: "Direct Access", desc: "Backers can message Organizers directly through our platform to ask questions and get clarification." },
              { title: "Public Comments", desc: "Our open comment sections allow the community to hold Organizers accountable and share feedback." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Fighting Fraud</h2>
              <p className="text-gray-500 text-sm">We adhere to strict Nevada consumer protection standards</p>
            </div>
          </div>
          <div className="pl-14 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Zero Tolerance</p>
                <p className="text-gray-600 text-sm leading-relaxed">We have a dedicated team that monitors for suspicious activity. If we detect fraudulent behavior, we freeze the campaign immediately.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Reporting Tools</p>
                <p className="text-gray-600 text-sm leading-relaxed">Every project page has a &quot;Report this Project&quot; button. We investigate 100% of reports submitted by our community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5 — Benefit Corp Promise */}
        <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Our Promise as a Benefit Corp</h2>
              <p className="text-gray-500 text-sm">Mission before profit — always</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            Unlike traditional platforms that may prioritize transaction volume over quality, our legal structure as a Nevada Benefit Corporation requires us to consider the public benefit in every decision we make. If a project is harmful to the community or violates our Non-Discrimination Policy, we take action — even if it means losing out on revenue.
          </p>
        </div>

        {/* Report CTA */}
        <div className="border border-gray-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">See something that doesn&apos;t look right?</h3>
          <p className="text-gray-600 text-sm mb-4">Use the &quot;Report this Project&quot; button on any campaign page, or contact our trust &amp; safety team directly.</p>
          <a
            href="mailto:safety@communityfundings.com"
            className="inline-block px-6 py-2.5 bg-[#8BC34A] text-white rounded-lg text-sm font-medium hover:bg-[#7CB342] transition-colors"
          >
            Contact Trust &amp; Safety
          </a>
        </div>

      </section>

      <Footer />
    </div>
  );
}
