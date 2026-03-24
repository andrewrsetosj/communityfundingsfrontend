import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const faqSections = [
  {
    section: "General Questions",
    questions: [
      {
        q: "What is Community Fundings?",
        a: "We are a crowdfunding platform based in Las Vegas, Nevada, dedicated to helping creators bring their projects to life. As a Benefit Corporation, we are legally committed to prioritizing social impact and the arts over pure profit.",
      },
      {
        q: "What does it mean to be a Benefit Corporation?",
        a: 'It means we have a "double bottom line." While we are a for-profit company, our corporate charter legally obligates us to consider how our decisions affect society and the creative community. We measure our success by the projects we help launch and the inequality we help fight.',
      },
    ],
  },
  {
    section: "For Backers (Supporting Projects)",
    questions: [
      {
        q: "Is my pledge a purchase?",
        a: "Not exactly. When you back a project, you are supporting a creator's journey to build something new. In return, creators often offer \"rewards\" (like a copy of the finished work or a special experience). It's a support system, not a traditional retail store.",
      },
      {
        q: "When will I be charged?",
        a: 'If the project is "All-or-Nothing," you will only be charged if the campaign successfully reaches its funding goal by the deadline. If the project doesn\'t hit its goal, you aren\'t charged a cent.',
      },
      {
        q: "Can I get a refund?",
        a: null,
        subPoints: [
          {
            label: "Before the deadline:",
            text: "Yes, you can cancel your pledge at any time through your account settings.",
          },
          {
            label: "After the deadline:",
            text: "Once the campaign ends and funds are sent to the creator, Community Fundings cannot issue refunds. You must contact the Campaign Organizer directly for refund requests.",
          },
        ],
      },
    ],
  },
  {
    section: "For Creators (Organizing Campaigns)",
    questions: [
      {
        q: "Who can start a project on Community Fundings?",
        a: "Anyone with a creative project that aligns with our mission! We focus on the arts, technology, and community-driven initiatives. All projects must pass our Trust & Safety review and comply with our Non-Discrimination Policy.",
      },
      {
        q: "What are the fees?",
        a: null,
        intro: "We keep it simple:",
        subPoints: [
          {
            label: "Individual Accounts:",
            text: "3% of total funds raised.",
          },
          {
            label: "Add ons:",
            text: "Instant payout: 1% of total funds raised.",
          },
          {
            label: "Business Accounts:",
            text: "$49 a month + 3.5% of total funds raised.",
          },
        ],
      },
      {
        q: "Do I keep ownership of my work?",
        a: "Absolutely. You retain 100% of your intellectual property. You only grant us a license to show off your project to help you get funded and to include your success in our Annual Benefit Statement.",
      },
    ],
  },
  {
    section: "Trust & Safety",
    questions: [
      {
        q: "How do I know a project is legitimate?",
        a: 'Every Organizer must pass an identity verification check. We also encourage you to look at the "Risks and Challenges" section on every project page and check the Organizer\'s history of communication.',
      },
      {
        q: "What happens if an Organizer doesn't deliver?",
        a: "Organizers are legally bound by our terms and their agreement with you to complete the project. If they run into trouble, they are required to post an update at least every 30 days to keep the community informed.",
      },
      {
        q: "How do I report a violation?",
        a: 'If you see a project that promotes hate speech, discrimination, or fraud, click the "Report this Project" button at the bottom of the campaign page. Our Las Vegas-based team investigates all reports within 48 hours.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
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
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-xl">
            Everything you need to know about Community Fundings — from how pledges work to creator
            fees and trust &amp; safety.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-14">
        {faqSections.map((section) => (
          <div key={section.section}>
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-[#8BC34A] rounded-full" />
              <h2 className="text-xl font-bold text-gray-900">{section.section}</h2>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {section.questions.map((item) => (
                <div
                  key={item.q}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-3">{item.q}</h3>

                  {item.a && (
                    <p className="text-gray-600 leading-relaxed">{item.a}</p>
                  )}

                  {"intro" in item && item.intro && (
                    <p className="text-gray-600 leading-relaxed mb-3">{item.intro}</p>
                  )}

                  {"subPoints" in item && item.subPoints && (
                    <ul className="space-y-2 mt-2">
                      {item.subPoints.map((point) => (
                        <li key={point.label} className="text-gray-600 leading-relaxed">
                          <span className="font-semibold text-gray-800">{point.label}</span>{" "}
                          {point.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-[#8BC34A] py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-white/90 mb-6">
            Our Las Vegas-based team is happy to help.
          </p>
          <Link
            href="mailto:support@communityfundings.com"
            className="bg-white text-[#8BC34A] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
