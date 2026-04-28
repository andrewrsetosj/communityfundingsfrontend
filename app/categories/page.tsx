import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type CategoryItem = {
  name: string;
  count: number;
};

const ALL_CATEGORIES = [
  "Art",
  "Comics",
  "Crafts",
  "Dance",
  "Design",
  "Environment",
  "Education",
  "Entertainment",
  "Health",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater",
] as const;

const categoryIconsBySlug: Record<string, string> = {
  art: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  comics: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  "crafts": "M12 3a9 9 0 100 18c1.657 0 3-1.343 3-3 0-.552-.224-1.052-.586-1.414A2 2 0 0116 15h1a3 3 0 100-6h-1a2 2 0 01-1.414-.586A1.994 1.994 0 0114 7c0-1.657-1.343-3-3-3zM7 10a1 1 0 110-2 1 1 0 010 2zm2-3a1 1 0 110-2 1 1 0 010 2zm4 1a1 1 0 110-2 1 1 0 010 2zm2 3a1 1 0 110-2 1 1 0 010 2z",
  dance: "M14.25 6.087c0-.67.214-1.29.577-1.796.726-1.012 1.934-1.666 3.327-1.666 2.209 0 4 1.79 4 4 0 1.393-.654 2.601-1.666 3.327-.507.363-1.127.577-1.796.577-.561 0-1.095-.15-1.556-.413L9 18.75l-3.75.75.75-3.75 8.663-8.163c-.263-.46-.413-.995-.413-1.556zM6 21a3 3 0 100-6 3 3 0 000 6z",
  design: "M12 4.5l7.5 7.5-7.5 7.5L4.5 12 12 4.5zm0 0V3m0 18v-1.5M19.5 12H21M3 12h1.5",
  environment: "M12 21c4.97-4.412 8-8.056 8-11.5A4.5 4.5 0 0015.5 5c-1.54 0-2.72.73-3.5 1.88C11.22 5.73 10.04 5 8.5 5A4.5 4.5 0 004 9.5C4 12.944 7.03 16.588 12 21z",
  education: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0118 14.576c0 1.183-.29 2.298-.804 3.278C15.744 18.558 13.977 19 12 19s-3.744-.442-5.196-1.146A6.965 6.965 0 016 14.576c0-1.47.429-2.84 1.16-3.998L12 14z",
  entertainment: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  health: "M4.5 12.75l6 6 9-13.5",
  fashion: "M16 3l1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4zM6 13l.75 3.25L10 17l-3.25.75L6 21l-.75-3.25L2 17l3.25-.75L6 13zM13 13l6 8H7l6-8z",
  "film-and-video": "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  food: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z",
  games: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
  journalism: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  music: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  photography: "M3 7.5A2.5 2.5 0 015.5 5h2.379a1.5 1.5 0 001.06-.44l.621-.62A1.5 1.5 0 0110.621 3.5h2.758a1.5 1.5 0 011.06.44l.621.62a1.5 1.5 0 001.06.44H18.5A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9zM12 16a4 4 0 100-8 4 4 0 000 8z",
  publishing: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  technology: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  theater: "M18 5v10M6 5v10M3 7h3m12 0h3M4 19h16a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1zm4-8c.667.667 1.333 1 2 1s1.333-.333 2-1m-4 4h.01M16 11c-.667.667-1.333 1-2 1s-1.333-.333-2-1m4 4h.01",
};

function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/campaigns/categories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const apiCategories = await getCategories();

  const countBySlug = new Map(
    apiCategories.map((category) => [slugifyCategory(category.name), category.count])
  );

  const categories = ALL_CATEGORIES.map((name) => ({
    name,
    count: countBySlug.get(slugifyCategory(name)) ?? 0,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
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

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Categories
          </h1>

          <p className="text-gray-600 max-w-xl mb-6">
            Explore campaigns by category. Find creative work that inspires you
            and support the creators behind them.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const slug = slugifyCategory(category.name);
            const iconPath = categoryIconsBySlug[slug];

            return (
              <Link
                key={slug}
                href={`/categories/${slug}`}
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
                      d={iconPath}
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#8BC34A] transition-colors">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {category.count.toLocaleString()} campaign{category.count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}