import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectCarousel from "./components/ProjectCarousel";
import HomeStretchSection from "./components/HomeStretchSection";
import ProjectsNearYouSection from "./components/ProjectsNearYouSection";
import CommunityFavoritesSection from "./components/CommunityFavoritesSection";
import FeaturedCampaignSection from "./components/FeaturedCampaignSection";
import PlatformStats from "./components/PlatformStats";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#8BC34A] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          {/* Wavy top decoration */}
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
          {/* Lily pad decorations */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#689F38] rounded-full opacity-20" />
          <div className="absolute top-20 right-20 w-24 h-24 bg-[#558B2F] rounded-full opacity-20" />
          <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-[#7CB342] rounded-full opacity-15" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-[#8BC34A] rounded-full opacity-25" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto">
            Community Makes it Possible
          </h1>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Let's build something bigger than ourselves. 
          </p>

          <div className="flex justify-center mb-16">
            <SignedIn>
              <Link
                href="/create-project/basics"
                className="bg-white text-[#8BC34A] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Start a Project
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="bg-white text-[#8BC34A] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Start a Project
              </Link>
            </SignedOut>
          </div>

          {/* Stats */}
          <PlatformStats />
        </div>
      </section>

      {/* Featured Campaign */}
      <FeaturedCampaignSection />

      {/* Recommended for you */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Recommended for you
              </h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              </p>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              </p>
              <button className="bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors">
                See Recommended Projects
              </button>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
                alt="Recommended"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Near You */}
      <ProjectsNearYouSection />

      {/* Community Favorites */}
      <CommunityFavoritesSection />

      {/* Home Stretch */}
      <HomeStretchSection />

      {/* Meet Community Council */}
      <section className="bg-[#8BC34A] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Meet Community Council
            </h2>
            <p className="text-white/90 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            </p>
            <div className="flex gap-4">
              <button className="bg-[#689F38] text-white px-6 py-3 rounded-full font-medium hover:bg-[#558B2F] transition-colors">
                Read More
              </button>
              <button className="bg-white text-[#8BC34A] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Press */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            The Press
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((item) => (
            <Link key={item} href="/project/1" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block">
              <div className="relative h-56 bg-gray-200">
                <Image
                  src={`https://images.unsplash.com/photo-155484762${item}851-c926e3f89e4c?w=600`}
                  alt="Press article"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  Funded 1/10 Project By: <span className="font-medium">JOEL PEDERSON</span>
                </p>
                <p className="text-sm text-gray-500">Funders: $60</p>
                <div className="flex items-center text-xs text-gray-400 space-x-3 mt-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save
                  </span>
                  <span>0 Flocks</span>
                  <span>&gt; Mty</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interviews from Our Local Business Owners */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Interviews from Our Local Business Owners
              </h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ut minima veniam, quis nostrud exercitation ullamco
              </p>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Watch Interview
              </button>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600"
                alt="Interview video"
                fill
                className="object-cover"
              />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#7CB342] transition-colors">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}