import Link from "next/link";
import Header from "../components/Header";

const categories = [
  { name: "Comics & Illustration", slug: "comics-illustration", count: 12453 },
  { name: "Design & Tech", slug: "design-tech", count: 8921 },
  { name: "Food & Craft", slug: "food-craft", count: 6234 },
  { name: "Arts", slug: "arts", count: 15678 },
  { name: "Film", slug: "film", count: 9876 },
  { name: "Game", slug: "game", count: 11234 },
  { name: "Music", slug: "music", count: 7890 },
  { name: "Publishing", slug: "publishing", count: 5432 },
];

export default function CategoriesPage() {
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
              Home
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Categories
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-xl mb-6">
            Explore projects by category. Find creative work that inspires you
            and support the creators behind them.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-[#8BC34A] hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8BC34A]/20 transition-colors">
                <svg
                  className="w-6 h-6 text-[#8BC34A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#8BC34A] transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.count.toLocaleString()} projects
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
                Community Fundings
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer">lorem ipsum dolor</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2011-2022 community funding ltd is registered in england and wales no. 07831511.
          </div>
        </div>
      </footer>
    </div>
  );
}
