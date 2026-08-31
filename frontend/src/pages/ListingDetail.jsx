// Import React hooks
import { useEffect, useState } from 'react';
// Import router
import { useParams, useNavigate } from 'react-router-dom';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import API
import { listingApi, reservationApi, reviewApi } from '../services/api';

// Listing detail page
export default function ListingDetail() {
  // Get listing ID from URL
  const { id } = useParams();
  // Navigation hook
  const navigate = useNavigate();
  // State for listing
  const [listing, setListing] = useState(null);
  // State for reviews
  const [reviews, setReviews] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for reserve modal
  const [showReserveModal, setShowReserveModal] = useState(false);
  // State for reservation form
  const [reservationForm, setReservationForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  // State for submitting reservation
  const [submitting, setSubmitting] = useState(false);
  // State for reservation success
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingResponse = await listingApi.getById(id);
        setListing(listingResponse.data);

        const reviewsResponse = await reviewApi.getByListing(id);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Handle reservation submit
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // In production, we would create a user or link to existing
      // For now, this is a simplified flow
      await reservationApi.create({
        listingId: id,
      });

      setReservationSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowReserveModal(false);
        setReservationSuccess(false);
        setReservationForm({ fullName: '', phone: '', email: '' });
      }, 2000);
    } catch (error) {
      console.error('Reservation failed:', error);
      alert('Could not reserve this item. It may already be reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src="/logo.svg" alt="Marketplace" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }

  // Show not found
  if (!listing) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image placeholder */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>

        {/* Details */}
        <div>
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>

          {/* Price */}
          <p className="mt-4 text-3xl font-bold text-green-600">
            {listing.price.toLocaleString()} {listing.currency}
          </p>

          {/* Status */}
          <div className="mt-4 flex items-center gap-2">
            {listing.isAvailable ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                Available
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                Reserved
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {listing.categoryName}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Business info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900">Seller</h3>
            <p className="mt-1 text-gray-600">{listing.businessName}</p>
          </div>

          {/* Reserve button */}
          {listing.isAvailable && (
            <button
              onClick={() => setShowReserveModal(true)}
              className="mt-8 w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Reserve This Item
            </button>
          )}

          {/* Views */}
          <p className="mt-4 text-sm text-gray-400">
            {listing.viewCount} views
          </p>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 mt-4">No reviews yet.</p>
        ) : (
          <div className="space-y-4 mt-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {review.rating}/5
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reserve Modal */}
      <AnimatePresence>
        {showReserveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReserveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900">Reserve This Item</h2>
              <p className="text-sm text-gray-500 mt-2">
                This holds the item for 60 minutes.
              </p>

              {reservationSuccess ? (
                <div className="mt-6 text-center py-8">
                  <p className="text-green-600 font-semibold text-lg">
                    Reservation successful!
                  </p>
                  <p className="text-gray-500 mt-2">
                    The seller will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reservationForm.fullName}
                      onChange={(e) => setReservationForm({ ...reservationForm, fullName: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowReserveModal(false)}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Reserving...' : 'Confirm Reserve'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}