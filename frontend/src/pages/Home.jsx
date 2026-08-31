// Import React hooks
import { useEffect, useState } from 'react';

// Import motion
import { motion } from 'framer-motion';

// Import API
import { listingApi, categoryApi } from '../services/api';

// Import components
import ListingCard from '../components/ListingCard';
import LoadingScreen from '../components/LoadingScreen';

// Home page
export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          featuredResponse,
          recentResponse,
          categoriesResponse,
        ] = await Promise.all([
          listingApi.getFeatured(8),
          listingApi.getAll(),
          categoryApi.getAll(),
        ]);

        setFeaturedListings(featuredResponse.data);
        setRecentListings(recentResponse.data);
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
    <div className="min-h-screen bg-gray-50">

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative h-[500px] w-full overflow-hidden">

        {/* Hero image */}
        <img
          src="/hero.jpg"
          alt="African market"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Hero image failed to load:', e.target.src);
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              Your Market, Now Online
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl text-gray-200"
            >
              Discover local products, property, vehicles, and services
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <a
                href="/search"
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                Browse Listings
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {featuredListings.length + recentListings.length}+
              </p>
              <p className="text-sm text-gray-500">
                Listings
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
              <p className="text-sm text-gray-500">
                Categories
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">
                60
              </p>
              <p className="text-sm text-gray-500">
                Min Reservation
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">

          {categories.slice(0, 10).map((category, index) => (
            <motion.a
              key={category.id}
              href={`/search?category=${category.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:border-green-500 hover:shadow-md transition-all"
            >
              <span className="font-medium text-gray-900">
                {category.name}
              </span>
            </motion.a>
          ))}

        </div>

        {categories.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            No categories available.
          </p>
        )}

      </section>

      {/* ==================== FEATURED LISTINGS ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Listings
          </h2>

          <a
            href="/search"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

          {featuredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}

        </div>

        {featuredListings.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            No featured listings yet.
          </p>
        )}

      </section>

      {/* ==================== RECENTLY ADDED ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recently Added
          </h2>

          <a
            href="/search"
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">

          {recentListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}

        </div>

        {recentListings.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            No listings yet.
          </p>
        )}

      </section>

      {/* ==================== TRUST BADGES ==================== */}
      <section className="bg-white border-t border-gray-200 mt-16 py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            {/* Verified Sellers */}
            <div>

              <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">
                  V
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                Verified Sellers
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Trust signals on every listing
              </p>

            </div>

            {/* Local First */}
            <div>

              <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">
                  L
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                Local First
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Built for Cameroonian commerce
              </p>

            </div>

            {/* Reserve Safely */}
            <div>

              <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">
                  R
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                Reserve Safely
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Hold items for 60 minutes
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
