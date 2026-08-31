// Import React hooks
import { useEffect, useState } from 'react';
// Import router
import { useSearchParams } from 'react-router-dom';
// Import API
import { listingApi } from '../services/api';
// Import components
import ListingCard from '../components/ListingCard';

// Search results page
export default function SearchResults() {
  // Get search params from URL
  const [searchParams] = useSearchParams();
  // Get query from URL
  const query = searchParams.get('q') || '';
  // State for listings
  const [listings, setListings] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);

  // Fetch listings when query changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await listingApi.search(query, 1, 50);
        setListings(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? `Results for "${query}"` : 'All Listings'}
        </h1>
        <p className="text-gray-500 mt-2">
          {listings.length} results found
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <img src="/logo.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
        </div>
      )}

      {/* Results grid */}
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