import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

const projects = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f" },
  { id: 3, image: "photo-1514525253161-7a46d19cd819" },
  { id: 4, image: "photo-1506905925346-21bda4d32df4" },
  { id: 5, image: "photo-1485846234645-a62644f84728" },
  { id: 6, image: "photo-1493225457124-a3eb161ffa5f" },
  { id: 7, image: "photo-1550751827-4bd374c3f58b" },
  { id: 8, image: "photo-1518837695005-2083093ee35b" },
  { id: 9, image: "photo-1532012197267-da84d127e765" },
  { id: 10, image: "photo-1511632765486-a01980e01a18" },
  { id: 11, image: "photo-1497436072909-60f360e1d4b1" },
  { id: 12, image: "photo-1469474968028-56623f02e42e" },
];

export default function ProjectsWeLove() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors border border-gray-300 rounded-full px-4 py-2 bg-white"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Category page
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Projects We Love
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-xl mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          </p>

          {/* CTA Button */}
          <button className="bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors">
            Lorem ipsum dolor
          </button>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Title */}
        <h2 className="text-xl font-medium text-gray-900 mb-8">
          Explore <span className="font-bold">55,937 projects</span>
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href="/project/1" className="group cursor-pointer block">
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
                  <span className="flex items-center hover:text-[#8BC34A] transition-colors">
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
                  </span>
                  <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                    <span className="mr-1">$</span>
                    Fund
                  </span>
                  <span className="flex items-center hover:text-[#8BC34A] transition-colors">
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
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            View More
          </button>
        </div>
      </section>

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
