import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NonDiscriminationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F9F0] py-16 px-6 border-b border-[#8BC34A]/20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#8BC34A]/10 text-[#8BC34A] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            Equity &amp; Inclusion
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Non-Discrimination &amp; Equity Policy
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            We actively seek diversity as a core component of our mission.
          </p>
          <p className="text-sm text-gray-400">Last Updated: February 22, 2026 · Core Governing Document · Community Fundings, Nevada Benefit Corp</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* 1 — Commitment */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Our Commitment</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Community Fundings was founded on the belief that a more creative world is a more equitable world. This policy applies to our employees, our Campaign Organizers, our backers, and any third-party partners. We are a community and every member of it deserves to be treated with dignity and respect.
          </p>
        </div>

        {/* 2 — Protected Characteristics */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Protected Characteristics</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            In accordance with Nevada law (NRS Chapter 613) and our Corporate Charter, Community Fundings prohibits discrimination or harassment based on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Race, color, or ethnicity",
              "National origin or ancestry",
              "Religion or religious creed",
              "Sex, gender identity, or gender expression",
              "Sexual orientation",
              "Physical or mental disability",
              "Age (40 and over)",
              "Genetic information",
              "Military or veteran status",
              "Pregnancy and related conditions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-[#F5F9F0] rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-[#8BC34A] shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 — Hate Speech */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Zero Tolerance for Hate Speech</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            We define hate speech as any content or communication that promotes violence, incites hatred, promotes discrimination, or disparages on the basis of the protected characteristics listed above.
          </p>
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">For Organizers</p>
              <p className="text-gray-600 text-sm leading-relaxed">Any campaign found to contain hate speech or to be funding a project that promotes discriminatory ideologies will be removed immediately without a refund of platform fees.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">For Backers</p>
              <p className="text-gray-600 text-sm leading-relaxed">Any comments or messages containing discriminatory language will result in an immediate and permanent ban from the platform.</p>
            </div>
          </div>
        </div>

        {/* 4 — Equity */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">The Equity Clause</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            As a Benefit Corporation, we recognize that systemic inequality has historically limited access to funding for many creators. To actively combat this:
          </p>
          <ul className="space-y-3">
            {[
              "We actively seek to highlight and promote campaigns from underrepresented and marginalized communities.",
              "We ensure our internal hiring and promotion practices in our Las Vegas headquarters are equitable and inclusive.",
              "We will never use creditworthiness or financial status as the sole metric for campaign approval if it disproportionately excludes communities with historically limited access to capital.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5 — Accessibility */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Accessibility</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We are committed to making our platform accessible to everyone. We strive to meet WCAG 2.1 Level AA standards to ensure that creators and backers with disabilities can fully participate in the Community Fundings ecosystem.
          </p>
        </div>

        {/* 6 — Reporting */}
        <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Reporting a Violation</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            If you believe a campaign, a user, or an employee of Community Fundings has violated this policy, please report it immediately. All reports will be investigated within 48 business hours. We strictly prohibit retaliation against anyone who reports discrimination or participates in an investigation.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Email:</strong>{" "}
              <a href="mailto:equity@communityfundings.com" className="text-[#8BC34A] hover:underline">
                equity@communityfundings.com
              </a>
              {" "}— Attn: Chief Impact Officer
            </p>
            <p><strong>On Platform:</strong> Use the &quot;Report this Project&quot; button found on every campaign page.</p>
          </div>
        </div>

        {/* 7 — Accountability */}
        <div>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-1.5">Accountability</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            The results of our non-discrimination and equity initiatives — including demographic data of funded projects where voluntarily provided — will be published in our Annual Benefit Statement to ensure we are living up to our Charter.
          </p>
        </div>

      </section>

      <Footer />
    </div>
  );
}
