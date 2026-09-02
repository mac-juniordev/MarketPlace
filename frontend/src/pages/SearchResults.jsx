// Import React hooks
import { useEffect, useState } from 'react';
// Import router
import { useSearchParams } from 'react-router-dom';
// Import motion
// import { motion } from 'framer-motion';
// Import API
import { listingApi } from '../services/api';
// Import components
import ListingCard from '../components/ListingCard';
// Import icons
import { MapPin, Search, X } from 'lucide-react';

// Search results page
export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const cityParam = searchParams.get('city') || '';
  const quarterParam = searchParams.get('quarter') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState(cityParam);
  const [quarterInput, setQuarterInput] = useState(quarterParam);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let response;

        if (categoryParam) {
          response = await listingApi.getByCategory(categoryParam);
        } else {
          response = await listingApi.search(query, 1, 50);
        }

        let results = response.data;

        // Filter by city
        if (cityParam) {
          results = results.filter((listing) =>
            listing.city?.toLowerCase().includes(cityParam.toLowerCase())
          );
        }

        // Filter by quarter
        if (quarterParam) {
          results = results.filter((listing) =>
            listing.quarter?.toLowerCase().includes(quarterParam.toLowerCase())
          );
        }

        setListings(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [query, categoryParam, cityParam, quarterParam]);

  const handleCitySearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (cityInput.trim()) {
      params.set('city', cityInput.trim());
    } else {
      params.delete('city');
    }
    if (quarterInput.trim()) {
      params.set('quarter', quarterInput.trim());
    } else {
      params.delete('quarter');
    }
    setSearchParams(params);
  };

  const clearLocationFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('city');
    params.delete('quarter');
    setSearchParams(params);
    setCityInput('');
    setQuarterInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? `Results for "${query}"` : 'All Listings'}
        </h1>
        <p className="text-gray-500 mt-2">
          {listings.length} results found
          {cityParam && ` in ${cityParam}`}
          {quarterParam && `, ${quarterParam}`}
        </p>
      </div>

      {/* Location filter */}
      <div className="mb-6">
        <form onSubmit={handleCitySearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Filter by city (e.g. Douala)"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={quarterInput}
              onChange={(e) => setQuarterInput(e.target.value)}
              placeholder="Filter by quarter (e.g. Bonapriso)"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-[#103c2d] px-6 text-sm font-bold text-white transition hover:bg-[#174d3a]"
          >
            Filter
          </button>
          {(cityParam || quarterParam) && (
            <button
              type="button"
              onClick={clearLocationFilters}
              className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:bg-gray-50 flex items-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <img src="/favicon.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && listings.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No listings found.</p>
        </div>
      )}
    </div>
  );
}