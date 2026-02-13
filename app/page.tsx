import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";

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
            <Link
              href="/create-project/basics"
              className="bg-white text-[#8BC34A] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Start a Project
            </Link>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  230,000
                </p>
                <p className="text-gray-500 text-sm">Projects funded</p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  $6,361,326,533
                </p>
                <p className="text-gray-500 text-sm">Towards creative work</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  70,894,973
                </p>
                <p className="text-gray-500 text-sm">Pledges</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Business or Project */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Featured Business or Project
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Card */}
          <Link href="/project/1" className="lg:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
            <div className="aspect-[16/10] bg-gray-200 relative">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Featured Project"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider mb-2 block">
                  Featured Business or Project
                </span>
                <h3 className="text-xl font-bold mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </h3>
              </div>
            </div>
          </Link>

          {/* Side Cards */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Link key={item} href="/project/1" className="flex gap-3 group cursor-pointer">
                <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={`https://images.unsplash.com/photo-151903176${item}074-81bece64645a?w=200`}
                    alt="Project thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur
                  </p>
                  <p className="text-xs text-gray-500">
                    Funded 1/10 Project By: <span className="font-medium">JOEL PEDERSON</span>
                  </p>
                  <p className="text-xs text-gray-500">Funders: $60</p>
                  <div className="flex items-center text-xs text-gray-400 space-x-2 mt-1">
                    <span>Save</span>
                    <span>0 Fund</span>
                    <span>&gt; Mty</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                Lorem ipsum
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

      {/* Project Near you */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Project Near you
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Link key={item} href="/project/1" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block">
              <div className="relative h-40 bg-gray-200">
                <Image
                  src={`https://images.unsplash.com/photo-150633263${item}355-506871c6b6c4?w=400`}
                  alt="Project"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cost of Living Crisis
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Funded 1/10 Project By: <span className="font-medium">JOEL PEDERSON</span>
                </p>
                <p className="text-xs text-gray-500 mb-3">Funders: $60</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                  <div className="bg-[#8BC34A] h-1 rounded-full w-1/3" />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save
                  </span>
                  <span>0 Fund</span>
                  <span>&gt; Mty</span>
                </div>
              </div>
              <div className="px-4 pb-4">
                <span className="w-full py-2 border border-[#8BC34A] text-[#8BC34A] rounded-full text-sm font-medium hover:bg-[#8BC34A] hover:text-white transition-colors block text-center">
                  Lorem ipsum
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community Favorites */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Community Favorites
            </h2>
            <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href="/project/1" className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block">
                <div className="relative h-36 bg-gray-200">
                  <Image
                    src={`https://images.unsplash.com/photo-149963932${item}710-8f4e1e4e3e4e?w=400`}
                    alt="Community Project"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-900 mb-1 line-clamp-2">
                    Lorem ipsum dolor sit amet, consectetur
                  </p>
                  <p className="text-xs text-gray-500">
                    Funded 1/10 Project By: <span className="font-medium">JOEL PEDERSON</span>
                  </p>
                  <p className="text-xs text-gray-500">Funders: $60</p>
                  <div className="flex items-center text-xs text-gray-400 space-x-2 mt-2">
                    <span>Save</span>
                    <span>0 Fund</span>
                    <span>&gt; Mty</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Home Stretch */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-500 mb-1">Lorem ipsum dolor sit amet</p>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Home Stretch
        </h2>

        <div className="flex flex-wrap gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-24 h-24 rounded-full bg-[#FFF8E1] border-4 border-[#FFD54F] flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFE082] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#F9A825]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
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
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
              </div>
            </div>

            {/* Links Column 2 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
              </div>
            </div>

            {/* Links Column 3 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
              </div>
            </div>

            {/* Links Column 4 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Lorem Ipsum</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">lorem ipsum dolor</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2011-2022 community funding ltd is registered in england and wales no. 07831511.
          </div>
        </div>
      </footer>
    </div>
  );
}
