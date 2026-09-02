import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Store } from 'lucide-react';

export default function ListingCard({ listing, index = 0 }) {
  // Support either businessId or business.id depending on the API response.
  const businessId =
    listing.businessId ||
    listing.business?.id ||
    listing.business?.businessId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: 'easeOut',
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
    >
      {/* Listing image */}
      <Link
        to={`/listing/${listing.id}`}
        className="block"
        aria-label={`View ${listing.title}`}
      >
        {listing.images && listing.images.length > 0 ? (
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <motion.img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              No Image
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link
          to={`/listing/${listing.id}`}
          className="block"
        >
          <h3 className="font-semibold text-gray-900 truncate hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>
        </Link>

        {/* Price */}
        <p className="mt-1 text-lg font-bold text-green-600">
          {listing.price?.toLocaleString()} {listing.currency || 'XAF'}
        </p>

        {/* Seller name */}
        {businessId ? (
          <Link
            to={`/seller/${businessId}`}
            className="mt-1 block text-sm text-emerald-700 hover:text-emerald-800 font-medium truncate transition-colors"
          >
            {listing.businessName || 'View seller'}
          </Link>
        ) : (
          <span className="mt-1 block text-sm text-gray-400 truncate">
            {listing.businessName || 'Seller unavailable'}
          </span>
        )}

        {/* Location */}
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          {listing.hasFixedLocation ? (
            <>
              <MapPin size={12} />

              <span className="truncate">
                {listing.quarter && `${listing.quarter}, `}
                {listing.city || 'Cameroon'}
              </span>
            </>
          ) : (
            <>
              <Store size={12} />

              <span>
                Contact for location
              </span>
            </>
          )}
        </div>

        {/* Category and availability */}
        <div className="mt-3 flex items-center gap-2">
          {listing.categoryName && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full truncate">
              {listing.categoryName}
            </span>
          )}

          {listing.isAvailable ? (
            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
              Available
            </span>
          ) : (
            <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full font-semibold">
              Reserved
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
