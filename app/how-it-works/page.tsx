import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const donorFeatures = [
  {
    title: "Browse & Discover Campaigns",
    description:
      "Explore thousands of verified campaigns across all categories. Filter by type, location, or funding goal to find projects that matter to you.",
    icon: (
      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Fund Projects You Believe In",
    description:
      "Contribute any amount to campaigns you care about. Every pledge helps bring creative visions and community projects to life.",
    icon: (
      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments via Stripe",
    description:
      "All donations are processed as payments through Stripe, ensuring security and safe handling. ",
    icon: (
      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const individualSteps = [
  {
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up with your email, and a secure password. Alternatively, sign up with Google for quick and easy account creation.",
  },
  {
    step: "02",
    title: "Verify Your Identity",
    description:
      "Complete email verification, or complete sign up with Google to verify your identity.",
  },
  {
    step: "03",
    title: "Launch Your Campaign",
    description:
      "Follow our curated campaign creation steps in order to start fundraising. Your campaign is personal to you — no team access or business registration required.",
  },
  {
    step: "04",
    title: "Receive Your Funds",
    description:
      "Once your campaign reaches its goal and closes, funds are transferred to your connected bank account. A 3% platform fee applies to all funds raised.",
  },
];

const businessSteps = [
  {
    step: "01",
    title: "Start with a Verified Individual Account",
    description:
      "All business accounts require a verified individual account first. This ensures accountability and links every business to a real, verified person.",
  },
  {
    step: "02",
    title: "Register Your Business",
    description:
      "Provide your legal business name, EIN or Tax ID, registered address, and other business information to verify and set up the business account.",
  },
  {
    step: "03",
    title: "Connect a Bank Account",
    description:
      "Link a business bank account or the account you wish to have funds released to once he campigns have reached their goals.",
  },
  {
    step: "04",
    title: "Invite Your Team",
    description:
      "Add team members and assign roles: Owner, Admin, Editor, or Viewer. Each role controls what team members can see and do on your campaigns.",
  },
  {
    step: "05",
    title: "Go Live",
    description:
      "Once your business account is set up, start creating campaigns under your business entity. Donors will see a Verified Business account, building trust and increasing campaign success.",
  },
];

const teamRoles = [
  {
    role: "Owner",
    singleOnly: true,
    description:
      "The business account is created from this individual. The Owner has full control of all account settings and every campaign. They have full edit and view access to all financial information and are the only role that can assign or change team member roles within the business.",
    permissions: [
      { label: "Campaigns", access: "Full edit & view", level: "full" },
      { label: "Financials", access: "Full edit & view", level: "full" },
      { label: "Team Roles", access: "Assign & manage", level: "full" },
    ],
  },
  {
    role: "Admin",
    singleOnly: false,
    description:
      "Admins have full edit and view access to all campaigns and full access to financial data. Admins cannot change or reassign team member roles — that is reserved for the Owner only.",
    permissions: [
      { label: "Campaigns", access: "Full edit & view", level: "full" },
      { label: "Financials", access: "Full edit & view", level: "full" },
      { label: "Team Roles", access: "No access", level: "none" },
    ],
  },
  {
    role: "Finance",
    singleOnly: false,
    description:
      "Finance have full edit and view access to all financial information and view only access to campaigns.",
    permissions: [
      { label: "Campaigns", access: "View only", level: "view" },
      { label: "Financials", access: "Full edit & view", level: "full" },
      { label: "Team Roles", access: "No access", level: "none" },
    ],
  },
  {
    role: "Editor",
    singleOnly: false,
    description:
      "Editors can create, edit, and view all campaign content and updates. They are focused entirely on campaign management and have no access to any financial data or team role settings.",
    permissions: [
      { label: "Campaigns", access: "Full edit & view", level: "full" },
      { label: "Financials", access: "No access", level: "none" },
      { label: "Team Roles", access: "No access", level: "none" },
    ],
  },
  {
    role: "Viewer",
    singleOnly: false,
    description:
      "Viewers are associated with the business but have read-only access to campaigns. They cannot edit any campaign content and have no access to financial information or team settings.",
    permissions: [
      { label: "Campaigns", access: "View only", level: "view" },
      { label: "Financials", access: "No access", level: "none" },
      { label: "Team Roles", access: "No access", level: "none" },
    ],
  },
];

export default async function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#8BC34A] overflow-hidden">
        <div className="absolute inset-0">
          <svg
            className="absolute top-0 left-0 w-full"
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 100C200 50 400 150 600 100C800 50 1000 150 1200 100C1400 50 1440 100 1440 100V0H0V100Z"
              fill="#7CB342"
              fillOpacity="0.3"
            />
          </svg>
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#689F38] rounded-full opacity-20" />
          <div className="absolute top-20 right-20 w-24 h-24 bg-[#558B2F] rounded-full opacity-20" />
          <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-[#7CB342] rounded-full opacity-15" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#8BC34A] rounded-full opacity-25" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-white/80 uppercase tracking-widest text-sm mb-4">How It Works</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Simple, Transparent, and Secure Fundraising
          </h1>
          <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Community Fundings is a crowdfunding and fundraising platform where individuals and
            businesses create campaigns to raise money from donors. Verified accounts, role-based
            team access, and secure payments make it easy to give and receive with confidence.
          </p>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              A Platform Built on Trust
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Community Fundings uses a hybrid model that combines the personal reach of individual
              fundraising with the credibility of verified business campaigns. Choose between launching campaigns through your individual 
              account, or connect with colleagues and launch through verified business accounts.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you&apos;re donating to a cause, raising money as an individual, or running
              campaigns for your organization — Community Fundings provides the infrastructure you
              need to do it securely and transparently.
            </p>
            <div className="flex gap-4 flex-wrap">
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#8BC34A] mb-1">3%</p>
              <p className="text-sm text-gray-600">Individual platform fee</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#8BC34A] mb-1">100%</p>
              <p className="text-sm text-gray-600">Stripe-secured payments</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <svg className="w-8 h-8 text-[#8BC34A] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600">Verified accounts</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#8BC34A] mb-1">5</p>
              <p className="text-sm text-gray-600">Business team roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Donors */}
      <section className="bg-gray-50 py-20" id="donors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#8BC34A] uppercase tracking-widest text-sm font-medium mb-3">
              For Donors
            </p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Give to What Matters
            </h2>
            <div className="w-16 h-1 bg-[#8BC34A] mx-auto rounded-full mb-4" />
            <p className="text-gray-600 max-w-xl mx-auto">
              As a donor on Community Fundings, you have a simple and secure way to support the
              campaigns and creators that inspire you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donorFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Accounts */}
      <section className="max-w-7xl mx-auto px-6 py-20" id="individual-accounts">
        <div className="text-center mb-14">
          <p className="text-[#8BC34A] uppercase tracking-widest text-sm font-medium mb-3">
            Individual Accounts
          </p>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Fundraise as Yourself
          </h2>
          <div className="w-16 h-1 bg-[#8BC34A] mx-auto rounded-full mb-4" />
          <p className="text-gray-600 max-w-xl mx-auto">
            Individual accounts are perfect for personal causes — creative endeavors, community projects, and more. Just a 3% platform fee, no monthly charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {individualSteps.map((item) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <span className="text-5xl font-bold text-[#8BC34A]/15 absolute top-4 right-6 select-none leading-none">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-gray-900 mb-3 pr-10">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#8BC34A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-900">Single-user accounts only.</span>{" "}
            Individual accounts are linked to one person and do not support team access. If you need
            to collaborate with team members or run campaigns under a business entity, consider a
            Business Account.
          </p>
        </div>
      </section>

      {/* Business Accounts */}
      <section className="bg-gray-50 py-20" id="business-accounts">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#8BC34A] uppercase tracking-widest text-sm font-medium mb-3">
              Business Accounts
            </p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Scale Your Fundraising
            </h2>
            <div className="w-16 h-1 bg-[#8BC34A] mx-auto rounded-full mb-4" />
            <p className="text-gray-600 max-w-xl mx-auto">
              Business accounts unlock team collaboration, role-based access, and enterprise-grade
              compliance tools. Ideal for organizations, nonprofits, and companies running multiple
              campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {businessSteps.map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
              >
                <span className="text-5xl font-bold text-[#8BC34A]/15 absolute top-4 right-6 select-none leading-none">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-3 pr-10">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Team Roles */}
          <div id="team-roles" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Business Team Roles</h3>
              <div className="w-16 h-1 bg-[#8BC34A] mx-auto rounded-full mb-4" />
              <p className="text-sm text-gray-500 max-w-xl mx-auto">
                Every business account has five roles that control what each team member can see and do.
                The Owner role is limited to one person per business — all other roles can be assigned to multiple team members.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teamRoles.map(({ role, singleOnly, description, permissions }) => (
                <div
                  key={role}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  {/* Title row */}
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-gray-900">{role}</h4>
                    {singleOnly && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#8BC34A]/10 text-[#8BC34A] font-medium whitespace-nowrap">
                        1 per business
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>

                  {/* Permissions — labeled rows */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                    {permissions.map(({ label, access, level }) => (
                      <div key={label} className="flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">{label}</span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          level === "full" ? "bg-[#8BC34A]/10 text-[#8BC34A]" :
                          level === "view" ? "bg-gray-100 text-gray-600" :
                          "bg-gray-50 text-gray-400"
                        }`}>
                          {access}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learn More: Pricing & Refunds */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">More Information</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Learn more about our fee structure and what happens if you need a refund.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/how-it-works/pricing"
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-10 hover:border-[#8BC34A] hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-[#8BC34A]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8BC34A]/20 transition-colors">
              <svg className="w-7 h-7 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8BC34A] transition-colors">
              Pricing
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              View our platform fees and plan options for individuals and businesses. Transparent,
              straightforward pricing with no hidden charges.
            </p>
            <span className="text-[#8BC34A] text-sm font-medium flex items-center gap-1">
              View Pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <Link
            href="/how-it-works/refunds"
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-10 hover:border-[#8BC34A] hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-[#8BC34A]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8BC34A]/20 transition-colors">
              <svg className="w-7 h-7 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8BC34A] transition-colors">
              Refund Policy
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Understand how refunds work on Community Fundings — from cancelling a pledge during an
              active campaign to what happens after a campaign closes.
            </p>
            <span className="text-[#8BC34A] text-sm font-medium flex items-center gap-1">
              Read Refund Policy
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#8BC34A] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 mb-8">
              Join thousands of creators, individuals, and businesses who trust Community Fundings
              to bring their ideas and causes to life.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/sign-up"
                className="bg-[#689F38] text-white px-6 py-3 rounded-full font-medium hover:bg-[#558B2F] transition-colors"
              >
                Create an Account
              </Link>
              <Link
                href="/projects-we-love"
                className="bg-white text-[#8BC34A] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}