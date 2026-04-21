import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const PER_PAGE = 12;
const PLACEHOLDER_IMAGE =
  "https://community-fundings-assets.s3.us-east-2.amazonaws.com/Hero/placeholderimg.jpeg";

  const ALL_CATEGORIES = [
  "Art",
  "Comics",
  "Crafts",
  "Dance",
  "Design",
  "Environment",
  "Education",
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

type CategoryItem = {
  name: string;
  count: number;
};

type Campaign = {
  id: number;
  title: string;
  slug: string | null;
  description?: string | null;
  goal_amount: number;
  raised_amount: number;
  creator_id?: string | null;
  creator_name?: string | null;
  status?: string | null;
  donors_count: number;
  category?: string | null;
  location?: string | null;
  end_date?: string | null;
  bio?: string | null;
  duration_days?: number | null;
  funding_percentage: number;
  days_left?: number | null;
  created_at?: string | null;
  image_url?: string | null;
  content_type?: string | null;
};

type CampaignListResponse = {
  campaigns: Campaign[];
  total: number;
  page: number;
  per_page: number;
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

async function getCategoryCampaigns(categoryName: string, page: number): Promise<CampaignListResponse> {
  const params = new URLSearchParams({
    status: "active",
    category: categoryName,
    sort: "recent",
    page: String(page),
    per_page: String(PER_PAGE),
  });

  try {
    const res = await fetch(`${API_URL}/api/campaigns?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        campaigns: [],
        total: 0,
        page,
        per_page: PER_PAGE,
      };
    }

    const data = await res.json();

    return {
      campaigns: Array.isArray(data?.campaigns) ? data.campaigns : [],
      total: typeof data?.total === "number" ? data.total : 0,
      page: typeof data?.page === "number" ? data.page : page,
      per_page: typeof data?.per_page === "number" ? data.per_page : PER_PAGE,
    };
  } catch (error) {
    console.error("Failed to load category campaigns:", error);
    return {
      campaigns: [],
      total: 0,
      page,
      per_page: PER_PAGE,
    };
  }
}

function getCategoryDescription(categoryName: string) {
  const descriptions: Record<string, string> = {
    "Comics & Illustration":
      "From webcomics and graphic novels to illustrated children's books, this is the home for visual storytelling. Back independent artists bringing their characters and worlds to life.",
    "Design & Tech":
      "Apps, hardware, software tools, and innovative tech products built by makers and developers. Support the next big idea before it hits the market.",
    "Food & Craft":
      "Artisan food brands, handmade goods, recipe books, and small-batch culinary ventures. Discover makers who put passion into every product.",
    Arts:
      "Paintings, sculptures, photography, printmaking, and mixed-media works by independent artists seeking support to create and exhibit their work.",
    Film:
      "Short films, feature-length independents, documentaries, and animation projects. Help filmmakers bring their stories to the screen.",
    Game:
      "Tabletop games, card games, video games, and interactive experiences crafted by indie creators. Back the next game you can't stop thinking about.",
    Music:
      "Albums, EPs, tours, music videos, and recording projects from independent musicians across every genre. Support the artists you love directly.",
    Publishing:
      "Books, poetry collections, journals, and print publications seeking readers and backers. Help independent writers get their words into the world.",
  };

  return (
    descriptions[categoryName] ||
    `Explore active campaigns in ${categoryName} and support creators bringing their ideas to life.`
  );
}

function formatUSD(amount?: number) {
  if (typeof amount !== "number") return "";
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(resolvedSearchParams?.page || "1") || 1);
  const categoryName = ALL_CATEGORIES.find(
    (name) => slugifyCategory(name) === slug
  );

  if (!categoryName) {
    notFound();
  }
  const categoryDescription = getCategoryDescription(categoryName);
  const { campaigns, total, per_page } = await getCategoryCampaigns(categoryName, page);

  const totalPages = Math.max(1, Math.ceil(total / per_page));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <Link
              href="/categories"
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
              Categories
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {categoryName}
          </h1>

          <p className="text-gray-600 max-w-xl mb-6">
            {categoryDescription}
          </p>

          <Link
            href="/create-project/basics"
            className="inline-flex bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            Start a Campaign
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-xl font-medium text-gray-900 mb-8">
          Explore{" "}
            <span className="font-bold">
              {total.toLocaleString()} {total === 1 ? "campaign" : "campaigns"}
            </span>{" "}
          in {categoryName}
        </h2>

        {campaigns.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-500">
              There are no active campaigns in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaigns.map((campaign) => {
                const imageSrc = campaign.image_url || PLACEHOLDER_IMAGE;
                const thumbIsVideo = (campaign.content_type ?? "")
                  .toLowerCase()
                  .startsWith("video/");

                return (
                  <Link
                    key={campaign.id}
                    href={`/project/${campaign.slug || campaign.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                      {thumbIsVideo ? (
                        <video
                          src={imageSrc}
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={campaign.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {campaign.title}
                      </h3>

                      <p className="text-xs text-gray-500 mb-1">
                        {Math.round(campaign.funding_percentage || 0)}% funded · By{" "}
                        <span className="font-semibold text-gray-700">
                          {campaign.creator_name || "Unknown creator"}
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 mb-2">
                        {campaign.donors_count} {campaign.donors_count === 1 ? "backer" : "backers"} ·{" "}
                        <span className="font-medium text-gray-700">
                          {formatUSD(campaign.raised_amount)}
                        </span>{" "}
                        raised
                      </p>

                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                        <div
                          className="h-2 bg-[#8BC34A]"
                          style={{
                            width: `${Math.min(100, Math.round(campaign.funding_percentage || 0))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                {page > 1 ? (
                  <Link
                    href={`/categories/${slug}?page=${page - 1}`}
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="px-8 py-3 border border-gray-200 rounded-full text-gray-300 font-medium">
                    Previous
                  </span>
                )}

                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/categories/${slug}?page=${page + 1}`}
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="px-8 py-3 border border-gray-200 rounded-full text-gray-300 font-medium">
                    Next
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}