import Header from "../components/Header";
import Footer from "../components/Footer";

export default function OrganizerAgreementPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F9F0] py-16 px-6 border-b border-[#8BC34A]/20">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-[#8BC34A]/10 text-[#8BC34A] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            For Campaign Organizers
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Campaign Organizer Agreement
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Everything you need to know about your responsibilities and rights as a Campaign Organizer on Community Fundings.
          </p>
          <p className="text-sm text-gray-400">Last Updated: February 22, 2026 · Jurisdiction: Las Vegas, Nevada</p>
        </div>
      </section>

      {/* Intro note */}
      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Legal Agreement:</strong> By clicking &quot;Start Campaign,&quot; you agree to be bound by the terms of this Agreement between you (&quot;Organizer&quot;) and Community Fundings, a Nevada Benefit Corporation (&quot;the Platform&quot;).
        </div>
      </div>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* 1 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">1</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Our Relationship: Facilitator, Not Partner</h2>
            </div>
          </div>
          <div className="pl-14 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>The Role:</strong> We are a neutral venue. We provide the digital infrastructure to connect your creative vision with backers. We do not manufacture, ship, or guarantee your rewards.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>No Agency:</strong> This agreement does not create a partnership, joint venture, or employer-employee relationship. You are an independent creator.</p>
            </div>
          </div>
        </div>

        {/* 2 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">2</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Mission Alignment &amp; Benefit Status</h2>
           
            </div>
          </div>
          <div className="pl-14 space-y-3">
            <p className="text-gray-600 text-sm leading-relaxed">As a Nevada Benefit Corporation, our legal purpose is to bring creative projects to life and fight inequality.</p>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>The Standard:</strong> We reserve the right to reject or remove any campaign that directly contradicts our Charter — projects promoting hate speech, discrimination, or those that do not align with our commitment to the arts.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>Reporting:</strong> You agree to provide basic updates on your project&apos;s progress so we can include your success in our Annual Benefit Statement.</p>
            </div>
          </div>
        </div>

        {/* 3 */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">3</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Obligations to Backers</h2>
              <p className="text-gray-500 text-sm">When funded, you enter a direct legal contract with your backers</p>
            </div>
          </div>
          <div className="pl-14 space-y-4">
            <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">Fulfillment</p>
              <p className="text-gray-600 text-sm leading-relaxed">You are legally required to fulfill all rewards promised or refund backers if you cannot. There are no exceptions.</p>
            </div>
            <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">Communication</p>
              <p className="text-gray-600 text-sm leading-relaxed">If your project hits a snag, you must post an update at least once every 30 days. Transparency is your best defense against &quot;Project Failure&quot; disputes.</p>
            </div>
            <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-xl p-5">
              <p className="font-semibold text-gray-900 text-sm mb-1">Nevada Consumer Protection</p>
              <p className="text-gray-600 text-sm leading-relaxed">You agree to comply with all Nevada consumer protection laws regarding the solicitation of funds.</p>
            </div>
          </div>
        </div>

        {/* 4 — Fees */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">4</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Fees &amp; Financials</h2>
              <p className="text-gray-500 text-sm">We believe in fair play and full transparency</p>
            </div>
          </div>
          <div className="pl-14">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <span>Fee Type</span>
                <span>Amount</span>
                <span>Notes</span>
              </div>
              {[
                ["Platform Fee", "5%", "Retained by Community Fundings from total funds raised"],
                ["Processing Fee", "~2.9% + $0.30", "Charged per transaction by Stripe"],
                ["Payout Timeline", "14 business days", "After successful conclusion, pending KYC verification"],
              ].map(([type, amount, note]) => (
                <div key={type} className="grid grid-cols-3 px-4 py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{type}</span>
                  <span className="text-[#8BC34A] font-semibold">{amount}</span>
                  <span className="text-gray-500 text-xs">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5 — IP */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">5</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Intellectual Property</h2>
          
            </div>
          </div>
          <div className="pl-14 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-600 text-sm leading-relaxed"><strong>You Own It:</strong> You retain 100% ownership of your creative work. Full stop.</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-600 text-sm leading-relaxed"><strong>Our License:</strong> You grant Community Fundings a non-exclusive, royalty-free, worldwide license to use your project images, videos, and descriptions solely to promote your campaign and our platform&apos;s social impact.</p>
            </div>
          </div>
        </div>

        {/* 6 — Taxes */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">6</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Taxes</h2>
             
            </div>
          </div>
          <div className="pl-14">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
              You are solely responsible for determining, collecting, and remitting any sales, use, or income taxes related to your campaign. Community Fundings does not provide tax or legal advice. We recommend consulting a CPA — especially regarding IRS Form 1099-K reporting thresholds.
            </div>
          </div>
        </div>

        {/* 7 — Liability */}
        <div>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">7</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Indemnification &amp; Liability</h2>
           
            </div>
          </div>
          <div className="pl-14 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>Hold Harmless:</strong> You agree to defend and hold Community Fundings harmless from any claims, damages, or legal fees arising from your project, your failure to deliver rewards, or your infringement of a third party&apos;s intellectual property.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A] mt-2 shrink-0" />
              <p className="text-gray-600 text-sm leading-relaxed"><strong>Limitation of Liability:</strong> To the maximum extent permitted by Nevada law, Community Fundings&apos; total liability to you shall not exceed the platform fees collected from your specific campaign.</p>
            </div>
          </div>
        </div>

        {/* 8 — Disputes */}
        <div className="bg-[#F5F9F0] border border-[#8BC34A]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#8BC34A] text-white flex items-center justify-center shrink-0 text-sm font-bold">8</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Dispute Resolution</h2>
              <p className="text-gray-500 text-sm">Clark County, Nevada</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p><strong className="text-gray-900">Governing Law:</strong> This agreement is governed by the laws of the State of Nevada.</p>
            <p><strong className="text-gray-900">Venue:</strong> Any legal action must be filed in the courts of Clark County, Nevada (Las Vegas).</p>
            <p><strong className="text-gray-900">Mediation First:</strong> Both parties agree to attempt informal mediation for at least 30 days before filing any formal legal claim.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-gray-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Questions about this agreement?</h3>
          <p className="text-gray-600 text-sm mb-4">Our team is here to help before you launch your campaign.</p>
          <a
            href="mailto:legal@communityfundings.com"
            className="inline-block px-6 py-2.5 bg-[#8BC34A] text-white rounded-lg text-sm font-medium hover:bg-[#7CB342] transition-colors"
          >
            Contact Legal Team
          </a>
        </div>

      </section>

      <Footer />
    </div>
  );
}
