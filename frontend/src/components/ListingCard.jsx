// Import motion for animations
import { motion } from 'framer-motion';
// Import router
import { Link } from 'react-router-dom';

// Listing card component
export default function ListingCard({ listing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link to={`/listing/${listing.id}`}>
        {/* Image */}
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">
            {listing.title}
          </h3>

          <p className="mt-1 text-lg font-bold text-green-600">
            {listing.price.toLocaleString()} {listing.currency || 'XAF'}
          </p>

          <p className="mt-1 text-sm text-gray-500 truncate">
            {listing.businessName}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {listing.categoryName}
            </span>
            {listing.isAvailable && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                Available
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}