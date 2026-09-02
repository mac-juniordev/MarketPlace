// Import React hooks
import { useEffect, useState } from 'react';
// Import router
import { useParams, useNavigate } from 'react-router-dom';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import API
import { listingApi, reservationApi, reviewApi, reportApi } from '../services/api';
// Import icons
import { MapPin, Phone, Star, Flag, X, Check, AlertTriangle } from 'lucide-react';

// Listing detail page
export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reserve modal
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    reason: '',
  });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

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

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reservationApi.create({ listingId: id });
      setReservationSuccess(true);
      setTimeout(() => {
        setShowReserveModal(false);
        setReservationSuccess(false);
        setReservationForm({ fullName: '', phone: '', email: '' });
      }, 2000);
    } catch (error) {
      alert('Could not reserve this item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await reviewApi.create({
        listingId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess(false);
        setReviewForm({ rating: 5, comment: '' });
      }, 2000);
    } catch (error) {
      alert('Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);

    try {
      await reportApi.create({
        reportedListingId: id,
        reason: reportForm.reason,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportForm({ reason: '' });
      }, 2000);
    } catch (error) {
      alert('Could not submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img src="/favicon.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Listing not found.</p>
      </div>
    );
  }

  const openGoogleMaps = () => {
    if (listing.latitude && listing.longitude) {
      window.open(`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`, '_blank');
    } else if (listing.city && listing.quarter) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.city + ' ' + listing.quarter)}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {listing.images && listing.images.length > 0 ? (
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Image thumbnails */}
          {listing.images && listing.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {listing.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <p className="mt-4 text-3xl font-bold text-green-600">
            {listing.price.toLocaleString()} {listing.currency || 'XAF'}
          </p>

          <div className="mt-4 flex items-center gap-2">
            {listing.isAvailable ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Available</span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Reserved</span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{listing.categoryName}</span>
          </div>

          {/* Location */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              Location
            </h3>
            {listing.hasFixedLocation ? (
              <div className="mt-2">
                <p className="text-gray-600">
                  {listing.quarter && `${listing.quarter}, `}
                  {listing.city || 'Cameroon'}
                </p>
                {listing.address && (
                  <p className="mt-1 text-sm text-gray-500">{listing.address}</p>
                )}
                <button
                  type="button"
                  onClick={openGoogleMaps}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  <MapPin size={16} />
                  View on Map
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-gray-600">Contact seller for location</p>
                <p className="mt-1 text-sm text-gray-500">Delivery or WhatsApp arrangement</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Business info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900">Seller</h3>
            <p className="mt-1 text-gray-600">{listing.businessName}</p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            {listing.isAvailable && (
              <button
                onClick={() => setShowReserveModal(true)}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Reserve This Item
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowReviewModal(true)}
                className="py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Star size={18} />
                Write Review
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="py-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <Flag size={18} />
                Report
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">{listing.viewCount} views</p>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 mt-4">No reviews yet. Be the first to review.</p>
        ) : (
          <div className="space-y-4 mt-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-gray-700">{review.rating}/5</span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESERVE MODAL */}
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
              <p className="text-sm text-gray-500 mt-2">This holds the item for 60 minutes.</p>

              {reservationSuccess ? (
                <div className="mt-6 text-center py-8">
                  <p className="text-green-600 font-semibold text-lg">Reservation successful!</p>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={reservationForm.fullName}
                      onChange={(e) => setReservationForm({ ...reservationForm, fullName: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowReserveModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {submitting ? 'Reserving...' : 'Confirm Reserve'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>

              {reviewSuccess ? (
                <div className="mt-6 text-center py-8">
                  <Check size={40} className="mx-auto text-green-600" />
                  <p className="text-green-600 font-semibold text-lg mt-3">Review submitted!</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        >
                          <Star
                            size={24}
                            className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={4}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submittingReview} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-600" />
                Report This Listing
              </h2>

              {reportSuccess ? (
                <div className="mt-6 text-center py-8">
                  <Check size={40} className="mx-auto text-green-600" />
                  <p className="text-green-600 font-semibold text-lg mt-3">Report submitted!</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea
                      required
                      value={reportForm.reason}
                      onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                      rows={4}
                      placeholder="Tell us why you are reporting this listing..."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submittingReport} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                      {submittingReport ? 'Submitting...' : 'Submit Report'}
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