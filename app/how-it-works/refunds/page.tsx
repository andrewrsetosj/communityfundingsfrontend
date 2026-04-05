import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const policySections = [
  {
    number: "1",
    title: "The Nature of Crowdfunding",
    content:
      "Community Fundings is a crowdfunding platform — not a store. When you pledge to a campaign, you are supporting a creator's vision, not purchasing a finished product. All creative projects involve risk, and by backing a campaign you acknowledge that delays, changes in scope, or unfulfilled rewards may occur. We strongly encourage donors to review a campaign thoroughly before pledging.",
  },
  {
    number: "2",
    title: "Refunds During an Active Campaign",
    content:
      "If a campaign is still open and has not yet reached its deadline, you may cancel your pledge and request a refund at any time through self-service. To do so, go to My Donations → Pledges, locate the relevant pledge, and select Cancel & Refund. Refunds for active campaigns are processed back to your original payment method, typically within 5–10 business days.",
  },
  {
    number: "3",
    title: "Refunds After a Campaign Ends",
    content:
      "Once a campaign has closed and funds have been transferred to the Campaign Organizer, refunds are no longer available through Community Fundings. Platform fees and payment processing fees are non-refundable in all circumstances. If you believe a closed campaign has misrepresented itself or failed to deliver on its promises, please contact the Campaign Organizer directly.",
  },
  {
    number: "4",
    title: "Organizer Responsibility",
    content:
      "After a campaign closes, all refund requests must be directed to the Campaign Organizer. Community Fundings is not responsible for refunds related to campaign rewards, delivery timelines, or creator decisions made after a campaign has successfully funded. We encourage Organizers to maintain open communication with their backers and to handle refund requests promptly and professionally.",
  },
  {
    number: "5",
    title: "Exceptional Circumstances",
    content:
      "In cases of confirmed fraud, material misrepresentation, or serious violations of our Terms of Service, Community Fundings may, at its sole discretion, issue refunds to affected donors. We actively monitor our platform for suspicious activity and take swift action when fraud is identified, including campaign suspension and referral to relevant authorities. We strongly discourage initiating chargebacks with your bank or card provider, as this may result in the suspension of the Campaign Organizer's account and can complicate the resolution process for all parties.",
  },
  {
    number: "6",
    title: "Disputes & Governing Law",
    content:
      "Any disputes arising from your use of Community Fundings, including refund-related matters not resolved through our support process, are governed by the laws of the State of Nevada. All legal proceedings shall take place in Clark County courts. By using our platform, you consent to this jurisdiction. For support inquiries, please contact us at support@communityfundings.com before initiating any formal dispute.",
  },
];

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F5F5] py-14">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/how-it-works"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors border border-gray-300 rounded-full px-4 py-2 bg-white mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            How It Works
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Last updated: February 22, 2026 &nbsp;·&nbsp; Las Vegas, Nevada
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-4">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
          <p className="text-gray-600 leading-relaxed">
            At Community Fundings, we are a Benefit Corporation dedicated to bringing creative
            projects to life. Because we are a platform and not a store, our refund policy is
            different from a typical retailer. By pledging to a campaign, you acknowledge and agree
            to the following terms.
          </p>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="max-w-4xl mx-auto px-6 py-8 pb-20">
        <div className="space-y-6">
          {policySections.map((section) => (
            <div
              key={section.number}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 bg-[#8BC34A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#8BC34A] font-bold text-sm">{section.number}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-12 bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-base font-medium text-gray-900 mb-2">Have questions about a refund?</p>
          <p className="text-gray-500 text-sm mb-6">
            Our support team is here to help. Reach out before initiating any formal dispute.
          </p>
          <a
            href="mailto:support@communityfundings.com"
            className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}