import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Legal document header */}
      <div className="bg-[#F5F9F0] text-gray-900 py-12 px-6 border-b border-[#8BC34A]/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#8BC34A] mb-2">Community Fundings</p>
          <h1 className="text-3xl font-mono font-bold mb-3">TERMS OF SERVICE</h1>
          <p className="text-gray-500 text-sm font-mono">Effective Date: February 22, 2026 | Last Updated: February 22, 2026</p>
          <p className="text-gray-500 text-sm font-mono mt-1">Jurisdiction: Las Vegas, Nevada | Community Fundings, a Nevada Benefit Corporation</p>
        </div>
      </div>

      {/* Document Body */}
      <div className="max-w-4xl mx-auto px-6 py-12 font-mono text-sm text-gray-800 space-y-10">

        <div className="text-gray-500 text-xs border-l-4 border-gray-300 pl-4 italic">
          PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING THE COMMUNITY FUNDINGS PLATFORM.
          BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS.
          IF YOU DO NOT AGREE, YOU MAY NOT USE OUR PLATFORM.
        </div>

        {/* I */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            I. PLATFORM ROLE &amp; OVERVIEW
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>1.1 Nature of Service.</strong> Community Fundings ("Platform," "we," "us," or "our") is a crowdfunding platform that connects Campaign Organizers ("Creators") with Backers. We are a facilitator, not a creator, manufacturer, or guarantor.</p>
            <p><strong>1.2 No Guarantee.</strong> Community Fundings does not guarantee the success, completion, legality, or quality of any project listed on the Platform. By using our services, you acknowledge that backing a campaign carries inherent risk.</p>
            <p><strong>1.3 Independent Contracts.</strong> When a campaign is successfully funded, a separate contract is formed directly between the Campaign Organizer and each Backer. Community Fundings is not a party to that contract.</p>
            <p><strong>1.4 Platform Changes.</strong> We reserve the right to modify, suspend, or discontinue any part of our services at any time with or without notice. We are not liable for any modification, suspension, or discontinuation.</p>
          </div>
        </section>

        {/* II */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            II. ELIGIBILITY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>2.1 Minimum Age.</strong> You must be at least eighteen (18) years of age to use this Platform. Users between the ages of thirteen (13) and seventeen (17) may use the Platform only with verifiable parental or guardian consent.</p>
            <p><strong>2.2 Legal Capacity.</strong> By using our Platform, you represent that you have the legal capacity to enter into a binding agreement and are not prohibited from using the services under applicable law.</p>
            <p><strong>2.3 Account Accuracy.</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
            <p><strong>2.4 Account Security.</strong> You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
          </div>
        </section>

        {/* III */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            III. BENEFIT CORPORATION STATUS
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>3.1 Mission-Driven Entity.</strong> Community Fundings is incorporated as a Nevada Benefit Corporation pursuant to NRS Chapter 78B. As such, our board of directors is legally required to consider the interests of our stakeholders, our community, and our mission alongside financial performance when making decisions.</p>
            <p><strong>3.2 Mission Charter.</strong> Our mission is to bring creative projects to life and fight inequality. Decisions regarding campaign approvals, fee structures, and platform policies may reflect mission alignment, not solely profit optimization.</p>
            <p><strong>3.3 Annual Benefit Statement.</strong> We publish an Annual Benefit Statement that reports on our progress toward our mission. Aggregated, non-identifiable data from campaigns may be used in this statement.</p>
            <p><strong>3.4 Campaign Rejection.</strong> We reserve the right to reject or remove any campaign that, in our sole determination, directly contradicts our Mission Charter, including but not limited to campaigns promoting hate, discrimination, or illegal activities.</p>
          </div>
        </section>

        {/* IV */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            IV. PLATFORM FEES
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>4.1 Platform Fee.</strong> Community Fundings retains five percent (5%) of the total funds raised upon successful campaign conclusion. This fee is non-refundable.</p>
            <p><strong>4.2 Processing Fees.</strong> Third-party payment processors (including but not limited to Stripe) charge approximately 2.9% + $0.30 per transaction. These fees are paid directly to the payment processor and are non-refundable.</p>
            <p><strong>4.3 Failed Campaigns.</strong> If a campaign does not reach its funding goal, backers will not be charged and no fees will be collected by Community Fundings.</p>
            <p><strong>4.4 Fee Changes.</strong> Community Fundings reserves the right to modify its fee structure with thirty (30) days' notice to existing Campaign Organizers.</p>
            <p><strong>4.5 Payouts.</strong> Funds are typically disbursed to Campaign Organizers within fourteen (14) business days of successful campaign conclusion, provided all identity verification (KYC) requirements are complete.</p>
          </div>
        </section>

        {/* V */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            V. ACCEPTABLE USE POLICY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>5.1 Prohibited Content.</strong> You agree not to use the Platform to create, promote, or fund any of the following:</p>
            <ul className="list-none pl-4 space-y-1 text-gray-600">
              <li>(a) Illegal items, services, or activities under Nevada, federal, or applicable international law;</li>
              <li>(b) Weapons, explosives, or materials designed to cause harm;</li>
              <li>(c) Multi-level marketing (MLM) schemes or "get rich quick" programs;</li>
              <li>(d) Misleading claims, fraudulent representations, or prototype images passed off as finished products;</li>
              <li>(e) Hate speech, harassment, or content that demeans individuals based on protected characteristics;</li>
              <li>(f) Content that violates third-party intellectual property rights;</li>
              <li>(g) Any content that violates our Non-Discrimination &amp; Equity Policy (Section VII).</li>
            </ul>
            <p><strong>5.2 Honesty Requirement.</strong> All campaign representations must be truthful and not materially misleading. Organizers must clearly distinguish between finished products and prototypes or works-in-progress.</p>
            <p><strong>5.3 Enforcement.</strong> Violation of this policy may result in immediate campaign removal, account suspension, forfeiture of collected platform fees, and/or referral to law enforcement authorities.</p>
          </div>
        </section>

        {/* VI */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            VI. CAMPAIGN ORGANIZER AGREEMENT
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>6.1 Independent Creator.</strong> Campaign Organizers are independent creators. This agreement does not create a partnership, joint venture, or employer-employee relationship between the Organizer and Community Fundings.</p>
            <p><strong>6.2 Fulfillment Obligation.</strong> Upon successful funding, Organizers are legally required to make every good faith effort to fulfill all promised rewards. If fulfillment becomes impossible, the Organizer must refund backers from the funds received.</p>
            <p><strong>6.3 Update Requirement.</strong> Organizers must post a project update at least once every thirty (30) days if the project is delayed or ongoing. Failure to maintain communication with backers may result in account suspension.</p>
            <p><strong>6.4 Nevada Consumer Protection.</strong> Organizers agree to comply with all applicable Nevada consumer protection statutes, including provisions governing solicitation of funds from the public.</p>
            <p><strong>6.5 Tax Responsibility.</strong> Organizers are solely responsible for determining, collecting, and remitting all applicable sales, use, or income taxes related to their campaign. Community Fundings does not provide tax or legal advice. IRS Form 1099-K reporting may apply.</p>
            <p><strong>6.6 Intellectual Property License.</strong> Organizers retain 100% ownership of their creative work. By launching a campaign, Organizers grant Community Fundings a non-exclusive, royalty-free, worldwide license to use campaign images, videos, and descriptions solely to promote the campaign and our platform's social impact.</p>
            <p><strong>6.7 Mission Reporting.</strong> Organizers agree to provide basic project progress updates to Community Fundings for inclusion in our Annual Benefit Statement.</p>
            <p><strong>6.8 Indemnification.</strong> Organizers agree to defend and hold Community Fundings harmless from any claims, damages, or legal fees arising from their project, failure to deliver rewards, or infringement of third-party intellectual property.</p>
          </div>
        </section>

        {/* VII */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            VII. NON-DISCRIMINATION POLICY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>7.1 Commitment.</strong> Community Fundings prohibits discrimination or harassment based on race, color, ethnicity, national origin, ancestry, religion, sex, gender identity, gender expression, sexual orientation, physical or mental disability, age (40 and over), genetic information, military or veteran status, or pregnancy and related conditions, in accordance with Nevada law (NRS Chapter 613) and our Corporate Charter.</p>
            <p><strong>7.2 Zero Tolerance for Hate Speech.</strong> Content that promotes violence, incites hatred, or disparages individuals based on the characteristics listed in Section 7.1 is strictly prohibited. Campaigns containing such content will be removed immediately without refund of platform fees.</p>
            <p><strong>7.3 Equity Initiatives.</strong> As a Benefit Corporation, Community Fundings actively seeks to highlight campaigns from underrepresented and marginalized communities. We will not use creditworthiness or financial status as the sole metric for campaign approval if it disproportionately excludes historically marginalized communities.</p>
            <p><strong>7.4 Accessibility.</strong> We are committed to meeting WCAG 2.1 Level AA standards to ensure full platform accessibility for users with disabilities.</p>
            <p><strong>7.5 Reporting Violations.</strong> Users may report violations using the "Report this Project" button on any campaign page or by emailing equity@communityfundings.com. All reports are investigated within 48 business hours. Retaliation against any person who reports a violation is strictly prohibited.</p>
          </div>
        </section>

        {/* VIII */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            VIII. REFUND POLICY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>8.1 Nature of Crowdfunding.</strong> Backing a project is not equivalent to purchasing a finished product. You are supporting a creator's effort to build something new.</p>
            <p><strong>8.2 Pre-Campaign Cancellation.</strong> Backers may cancel their pledge at any time before a campaign reaches its deadline via Account Settings under "Pledges."</p>
            <p><strong>8.3 Post-Campaign.</strong> Once a campaign is successfully funded and its deadline has passed, Community Fundings does not issue refunds. Platform fees (5%) and processing fees are non-refundable.</p>
            <p><strong>8.4 Organizer Responsibility.</strong> If you seek a refund after a campaign closes, you must contact the Campaign Organizer directly. The Organizer is solely responsible for issuing refunds from funds they received.</p>
            <p><strong>8.5 Fraudulent Campaigns.</strong> Community Fundings reserves the right to issue refunds at our sole discretion if a campaign is found to be fraudulent or in material violation of these Terms prior to fund disbursement.</p>
            <p><strong>8.6 Chargebacks.</strong> We strongly discourage credit card chargebacks. Unwarranted chargebacks may result in permanent account suspension.</p>
          </div>
        </section>

        {/* IX */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            IX. PRIVACY POLICY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>9.1 Data Collection.</strong> We collect identifiers (name, email, phone, address), financial information via our payment processor (we do not store full card numbers), creative data relating to campaign activity, and technical data (IP address, browser type, usage patterns).</p>
            <p><strong>9.2 Use of Data.</strong> We use data to facilitate crowdfunding, verify Campaign Organizer identity, and produce aggregated, non-identifiable social impact reports required by our Benefit Corporation status.</p>
            <p><strong>9.3 Data Sharing.</strong> We do not sell personal information. We share data with Campaign Organizers (backer name, email, and shipping address for reward fulfillment), service providers, and as required by law.</p>
            <p><strong>9.4 Nevada Privacy Rights (SB 220).</strong> Nevada residents may opt out of the sale of covered information by contacting privacy@communityfundings.com with subject line "Nevada Opt-Out Request."</p>
            <p><strong>9.5 GDPR / CCPA.</strong> Users in the European Economic Area and California have the right to access, correct, delete, or port their personal data. To exercise these rights, contact privacy@communityfundings.com.</p>
            <p><strong>9.6 Security.</strong> We employ SSL/TLS encryption and comply with Nevada data security requirements under NRS 603A.210.</p>
            <p><strong>9.7 Policy Updates.</strong> Material changes to our privacy practices will be communicated via homepage notice and email.</p>
          </div>
        </section>

        {/* X */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            X. COOKIE POLICY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>10.1 Essential Cookies.</strong> We use cookies required for login session management and payment security. These cannot be disabled without affecting core platform functionality.</p>
            <p><strong>10.2 Performance Cookies.</strong> We use analytics cookies to measure platform performance and identify trending projects. These cookies collect data in aggregate and do not identify individual users.</p>
            <p><strong>10.3 Global Privacy Control (GPC).</strong> Community Fundings honors Global Privacy Control (GPC) signals and "Do Not Track" browser settings as required by applicable 2026 state privacy laws. When a GPC signal is detected, we will not sell or share your personal information for targeted advertising.</p>
            <p><strong>10.4 Cookie Management.</strong> You may manage cookie preferences through your browser settings. Note that disabling non-essential cookies will not impair basic platform functionality.</p>
          </div>
        </section>

        {/* XI */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            XI. LIMITATION OF LIABILITY
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>11.1 No Warranty.</strong> THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
            <p><strong>11.2 Liability Cap.</strong> TO THE MAXIMUM EXTENT PERMITTED BY NEVADA LAW, COMMUNITY FUNDINGS' TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE TOTAL PLATFORM FEES COLLECTED FROM YOUR SPECIFIC CAMPAIGN, OR ONE HUNDRED DOLLARS ($100.00), WHICHEVER IS GREATER.</p>
            <p><strong>11.3 Exclusion of Damages.</strong> IN NO EVENT SHALL COMMUNITY FUNDINGS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM.</p>
            <p><strong>11.4 Project Failure.</strong> Community Fundings is not responsible for damages, losses, or unfulfilled rewards resulting from a Campaign Organizer's failure to complete their project.</p>
          </div>
        </section>

        {/* XII */}
        <section>
          <h2 className="text-base font-bold text-black border-b border-gray-300 pb-2 mb-4">
            XII. GOVERNING LAW &amp; DISPUTE RESOLUTION
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p><strong>12.1 Governing Law.</strong> These Terms are governed by the laws of the State of Nevada, without regard to its conflict of laws provisions.</p>
            <p><strong>12.2 Venue.</strong> Any legal action or proceeding arising from these Terms must be filed exclusively in the courts located in Clark County, Nevada (Las Vegas).</p>
            <p><strong>12.3 Informal Resolution.</strong> Both parties agree to attempt informal mediation for at least thirty (30) days before filing any formal legal claim.</p>
            <p><strong>12.4 Arbitration.</strong> At Community Fundings' election, disputes may be resolved by binding arbitration administered under the American Arbitration Association rules, except that either party may seek injunctive relief in court for intellectual property violations.</p>
            <p><strong>12.5 Class Action Waiver.</strong> TO THE EXTENT PERMITTED BY LAW, YOU WAIVE ANY RIGHT TO PARTICIPATE IN CLASS ACTION LITIGATION OR CLASS-WIDE ARBITRATION AGAINST COMMUNITY FUNDINGS.</p>
            <p><strong>12.6 Severability.</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
            <p><strong>12.7 Entire Agreement.</strong> These Terms, together with our Privacy Policy and Campaign Organizer Agreement (where applicable), constitute the entire agreement between you and Community Fundings regarding your use of the Platform.</p>
          </div>
        </section>

        <div className="border-t border-gray-300 pt-8 text-xs text-gray-400 leading-relaxed">
          <p>Community Fundings is a Nevada Benefit Corporation. Registered office: Las Vegas, Nevada.</p>
          <p className="mt-2">For legal inquiries: legal@communityfundings.com</p>
          <p className="mt-2">These Terms of Service were last reviewed and updated on February 22, 2026. Community Fundings reserves the right to update these Terms at any time. Continued use of the Platform after notice of changes constitutes acceptance of the revised Terms.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
