import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const teamMembers = [
  {
    name: "Joel",
    title: "Co-Founder & CEO",
    bio: "Joel has spent over a decade building community-first financial platforms and believes that access to funding should never be a barrier to creativity or impact.",
    photo: "photo-1472099645785-5658abf4ff4e",
  },
  {
    name: "Bryan",
    title: "Co-Founder & CEO",
    bio: " Bryan brings a background in nonprofit leadership and social enterprise, guiding Community Fundings' commitment to equity and transparent operations.",
    photo: "photo-1494790108377-be9c29b29330",
  },
  {
    name: "Name Here",
    title: "Head of Community",
    bio: "NAME _INSERT BIO.",
    photo: "photo-1507003211169-0a1dd7228f2d",
  },
];

const coreValues = [
  {
    title: "Fostering Creativity",
    description:
      "We are dedicated to the arts and the people who create them. Every tool and resource we build starts with the creator in mind.",
    icon: (
      <svg className="w-8 h-8 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "Promoting Equity",
    description:
      "We are committed to fighting inequality by actively working for a more equitable world — one funded project at a time.",
    icon: (
      <svg className="w-8 h-8 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    title: "Accountability",
    description:
      "Transparency is key to our structure. We deliver an annual benefit statement that publicly reports our progress toward defined public benefits.",
    icon: (
      <svg className="w-8 h-8 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#8BC34A] overflow-hidden">
        {/* Decorative Background */}
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
          <p className="text-white/80 uppercase tracking-widest text-sm mb-4">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Where Community Meets Opportunity.
          </h1>
          <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Community Fundings is a platform that empowers individuals and businesses to raise money
            transparently and securely. Our mission is to make fundraising simple, trustworthy, and
            accessible for everyone.
          </p>
          <Link
            href="/projects-we-love"
            className="bg-white text-[#8BC34A] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Explore Projects
          </Link>
        </div>
      </section>

      {/* About the Platform */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Built for Communities, by Communities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform provides a secure, transparent, and easy way for communities to raise,
              share, and manage funds for projects and causes they care about.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you&apos;re an independent artist, a small business, or a local organization,
              Community Fundings gives you the tools you need to connect with people who believe in
              your vision and want to help it succeed.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
              alt="Community collaboration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Charter Statement */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Community Fundings Charter Statement
            </h2>
            <div className="w-16 h-1 bg-[#8BC34A] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Who We Are */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Who We Are</h3>
              <p className="text-gray-600 leading-relaxed">
                Community Fundings is a Benefit Corporation. By charter, we are obligated to weigh the
                societal impact of every decision we make. We have chosen this structure because we
                believe business should be a force for good, and we measure our success by mission
                achievement alongside financial sustainability.
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide the tools and resources necessary to help bring creative projects to life
                and sustain them long-term. We are here to ensure that great ideas have a fair chance
                to reach the people who need them most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Our Core Values &amp; Commitments
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our daily operations are driven by a commitment to the following principles, which guide
            every product decision and partnership we make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-[#8BC34A]/10 rounded-2xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              The people behind Community Fundings are passionate about empowering creators, builders,
              and communities everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-36 h-36 mx-auto mb-5">
                  <Image
                    src={`https://images.unsplash.com/${member.photo}?w=300`}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-[#8BC34A] mb-3">{member.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#8BC34A] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Ready to Start Something?
            </h2>
            <p className="text-white/90 mb-8">
              Join thousands of creators and community leaders who are bringing their ideas to life
              on Community Fundings.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/how-it-works"
                className="bg-white text-[#8BC34A] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                How it Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}