import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { listingApi, categoryApi } from '../services/api';
import ListingCard from '../components/ListingCard';
import LoadingScreen from '../components/LoadingScreen';
import { MapPin, Flame, Store } from 'lucide-react';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [hotListings, setHotListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          featuredResponse,
          recentResponse,
          hotResponse,
          categoriesResponse,
        ] = await Promise.all([
          listingApi.getFeatured(8),
          listingApi.getAll(),
          listingApi.getHot(8),
          categoryApi.getAll(),
        ]);

        setFeaturedListings(featuredResponse.data);
        setRecentListings(recentResponse.data);
        setHotListings(hotResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-gray-900">
      {/* HERO - same as before */}
      <section className="relative isolate min-h-[560px] overflow-hidden sm:min-h-[620px]">
        <img
          src="/hero.jpg"
          alt="African marketplace"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 sm:min-h-[620px] sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              Discover what's available near you
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Your Marketplace.
              <br />
              <span className="text-yellow-400">Now Online.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl"
            >
              Discover products, vehicles, property and services from trusted local listings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="/search"
                className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-8 py-4 font-bold text-gray-950 shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-1 hover:bg-yellow-300"
              >
                Browse Listings
                <span className="ml-2 text-lg">→</span>
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20"
              >
                Explore Categories
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75"
            >
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Trusted listings
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Local marketplace
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Easy reservations
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-gray-200 px-5 py-7 sm:px-8 lg:px-10">
          <div className="text-center">
            <p className="text-2xl font-black text-[#103c2d] sm:text-3xl">{recentListings.length}+</p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#103c2d] sm:text-3xl">{categories.length}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#103c2d] sm:text-3xl">60</p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">Min reservation</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Explore</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              What are you looking for?
            </h2>
          </div>
          <a href="/search" className="hidden text-sm font-bold text-emerald-700 transition hover:text-emerald-900 sm:block">
            View all →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.slice(0, 10).map((category, index) => (
            <motion.a
              key={category.id}
              href={`/search?category=${category.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg font-black text-emerald-700 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                {category.name?.charAt(0)?.toUpperCase()}
              </div>
              <p className="font-bold text-gray-900">{category.name}</p>
              <p className="mt-1 text-xs text-gray-400">Explore →</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* WHAT'S HOT */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Trending now</p>
            <h2 className="mt-2 flex items-center gap-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              <Flame size={28} className="text-orange-500" />
              What's Hot
            </h2>
          </div>
          <a href="/search" className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900">
            See everything →
          </a>
        </div>

        {hotListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hotListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="font-semibold text-gray-700">No trending listings yet.</p>
          </div>
        )}
      </section>

      {/* FEATURED LISTINGS */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Handpicked for you</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Featured listings</h2>
          </div>
          <a href="/search" className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900">
            See everything →
          </a>
        </div>

        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="font-semibold text-gray-700">No featured listings yet.</p>
          </div>
        )}
      </section>

      {/* RESERVATION BANNER */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#103c2d] px-7 py-12 sm:px-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                Found something you like?
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Reserve it before someone else does.
              </h2>
              <p className="mt-3 text-emerald-50/70">
                Browse available listings, choose what you want, and reserve it for up to 60 minutes.
              </p>
            </div>
            <a
              href="/search"
              className="shrink-0 rounded-xl bg-yellow-400 px-7 py-4 text-center font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-1 hover:bg-yellow-300"
            >
              Find something →
            </a>
          </div>
        </div>
      </section>

      {/* RECENTLY ADDED */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Fresh on the marketplace</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Recently added</h2>
          </div>
          <a href="/search" className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900">
            View all →
          </a>
        </div>

        {recentListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentListings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="font-semibold text-gray-700">No listings yet.</p>
          </div>
        )}
      </section>

      {/* TRUST SECTION */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Shop with confidence</p>
            <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              A marketplace built around you
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-[#f8f7f3] p-7 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl font-bold text-emerald-700">✓</div>
              <h3 className="mt-5 text-lg font-black text-gray-900">Trusted listings</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Find listings with useful information and trust signals to help you decide.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8f7f3] p-7 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl font-bold text-yellow-700">◎</div>
              <h3 className="mt-5 text-lg font-black text-gray-900">Local marketplace</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover products, property, vehicles and services available around Cameroon.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8f7f3] p-7 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl font-bold text-orange-700">⏱</div>
              <h3 className="mt-5 text-lg font-black text-gray-900">Easy reservations</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Found something you want? Reserve it for 60 minutes while you arrange the next step.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}