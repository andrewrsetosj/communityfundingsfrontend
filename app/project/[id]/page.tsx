import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";

const recommendedProjects = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f" },
  { id: 3, image: "photo-1511632765486-a01980e01a18" },
  { id: 4, image: "photo-1469474968028-56623f02e42e" },
];

export default function ProjectDetail() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/projects-we-love"
            className="inline-flex items-center text-sm text-[#8BC34A] hover:text-[#7CB342] transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Projects We Love
          </Link>
        </div>

        {/* Project Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          ENCORE: BRONZE - THE ART OF LIAM SHARP
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            {/* Main Video/Image */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"
                alt="Project cover"
                fill
                className="object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <svg
                    className="w-6 h-6 text-gray-800 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Country Flags */}
            <div className="flex items-center gap-2 mb-6">
              {["🇬🇧", "🇺🇸", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷"].map((flag, i) => (
                <span key={i} className="text-xl">
                  {flag}
                </span>
              ))}
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Funding Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Funding Stats */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">US$ 60,984</p>
                <p className="text-sm text-gray-500 mb-4">Current pledged</p>

                <p className="text-2xl font-bold text-gray-900">427</p>
                <p className="text-sm text-gray-500 mb-4">backers</p>

                <p className="text-2xl font-bold text-gray-900">26</p>
                <p className="text-sm text-gray-500 mb-6">days to go</p>

                <button className="w-full bg-[#8BC34A] text-white py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors mb-3">
                  Lorem ipsum dolor
                </button>
                <p className="text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  and do eiusmod.
                </p>
              </div>

              {/* Creator Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#8BC34A]" />
                  <div>
                    <p className="font-semibold text-gray-900">Sharpy</p>
                    <p className="text-xs text-gray-500">4 created · 54 backed</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad
                  minima veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea.{" "}
                  <Link href="#" className="text-[#8BC34A] hover:underline">
                    Read More
                  </Link>
                </p>
              </div>

              {/* Support Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-xs text-gray-500 mb-3">Pledge without a reward</p>

                <div className="flex items-center border border-gray-200 rounded-lg mb-4">
                  <span className="px-3 text-gray-500">$</span>
                  <input
                    type="number"
                    defaultValue={10}
                    className="flex-1 py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad
                  minima veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea.{" "}
                  <Link href="#" className="text-[#8BC34A] hover:underline">
                    Read More
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minima veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
          </p>

          {/* Book Image and Green Circle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="relative aspect-[3/4] max-w-sm rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"
                alt="Book cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-start">
              <div className="w-24 h-24 rounded-full bg-[#8BC34A] opacity-80" />
            </div>
          </div>

          {/* About the Book */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">About the Book</h3>
          <p className="text-gray-600 mb-4 max-w-3xl">
            Eating is a tricky subject. And as a society, we have a pretty messed up relationship to
            food, eating, and body image. Harmful, fatphobic messages permeate our culture, our
            movies, music, and even our medicine, and make it that much harder to develop a healthy
            relationship with ourselves and our bodies.
          </p>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Dr. Faith Harper, author of the bestselling books Unfuck Your Brain and Unfuck Your Body is
            a therapist and clinical nutritionist and has helped a ton of clients with eating disorders
            and disordered eating. She lays out a huge amount of knowledge and perspective in this
            new book, with her trademark combo of science, swearing, and kind humor.
          </p>

          {/* Book Pages Preview */}
          <div className="relative aspect-[16/9] max-w-2xl rounded-lg overflow-hidden bg-gray-100 mb-8">
            <Image
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"
              alt="Book pages preview"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-gray-600 mb-8 max-w-3xl">
            She walks you through the difference between eating disorders and disordered eating and
            explains how trauma and other co-occurring conditions - as well as factors imposed on us
            by society - can lead to unhealthy relationships with food, eating, and our own selves.
          </p>

          {/* Report Button */}
          <button className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Report this project to CF
          </button>
        </section>

        {/* We Also Recommend Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            We Also Recommend
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProjects.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                {/* Project Image */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                  <Image
                    src={`https://images.unsplash.com/${project.image}?w=400`}
                    alt="Project thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Funded 1/10 Project By:{" "}
                    <span className="font-semibold text-gray-700">JOEL PEDERSON</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Funders: <span className="font-medium">$60</span>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <button className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      Save
                    </button>
                    <button className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <span className="mr-1">$</span>
                      Fund
                    </button>
                    <button className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              View More
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div>
              <span className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
                Community Fundings
              </span>
            </div>

            {/* Links Column 1 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
              </div>
            </div>

            {/* Links Column 2 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
              </div>
            </div>

            {/* Links Column 3 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  lorem ipsum dolor
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2011-2022 community funding ltd is registered in england and
            wales no. 07831511.
          </div>
        </div>
      </footer>
    </div>
  );
}
