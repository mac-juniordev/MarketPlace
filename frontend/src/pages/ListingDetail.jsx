import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Flag,
  X,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  MessageCircle,
  Store,
} from 'lucide-react';

import {
  listingApi,
  reservationApi,
  reviewApi,
  reportApi,
} from '../services/api';

export default function ListingDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Image gallery
  const [selectedImage, setSelectedImage] = useState(0);

  // Reservation
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState('');

  // Review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Report
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    reason: '',
  });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  // Fetch listing and reviews
  useEffect(() => {
    let mounted = true;

    const fetchListing = async () => {
      setLoading(true);
      setError('');

      try {
        const [listingResponse, reviewsResponse] = await Promise.all([
          listingApi.getById(id),
          reviewApi.getByListing(id),
        ]);

        if (!mounted) return;

        setListing(listingResponse.data);
        setReviews(reviewsResponse.data || []);
        setSelectedImage(0);
      } catch (err) {
        console.error('Failed to fetch listing:', err);

        if (mounted) {
          setError('Failed to load this listing. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchListing();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // Close modal and reset reservation state
  const closeReserveModal = () => {
    if (submitting) return;

    setShowReserveModal(false);
    setReservationSuccess(false);
    setReservationError('');
  };

  // Close modal and reset review state
  const closeReviewModal = () => {
    if (submittingReview) return;

    setShowReviewModal(false);
    setReviewSuccess(false);
    setReviewError('');
  };

  // Close modal and reset report state
  const closeReportModal = () => {
    if (submittingReport) return;

    setShowReportModal(false);
    setReportSuccess(false);
    setReportError('');
  };

  // Reservation
  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setReservationError('');

    try {
      // IMPORTANT:
      // Only ONE reservation request is sent.
      await reservationApi.create({
        listingId: id,
        buyerName: reservationForm.fullName.trim(),
        buyerPhone: reservationForm.phone.trim(),
        buyerEmail: reservationForm.email.trim(),
      });

      setReservationSuccess(true);

      // Update local listing immediately
      setListing((current) =>
        current
          ? {
            ...current,
            isAvailable: false,
          }
          : current
      );

      // Close after showing success
      setTimeout(() => {
        setShowReserveModal(false);
        setReservationSuccess(false);

        setReservationForm({
          fullName: '',
          phone: '',
          email: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Reservation failed:', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Could not reserve this item. Please try again.';

      setReservationError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (submittingReview) return;

    setSubmittingReview(true);
    setReviewError('');

    try {
      await reviewApi.create({
        listingId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });

      // Reload reviews so the new review appears immediately
      try {
        const reviewsResponse = await reviewApi.getByListing(id);
        setReviews(reviewsResponse.data || []);
      } catch (refreshError) {
        console.error('Could not refresh reviews:', refreshError);
      }

      setReviewSuccess(true);

      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess(false);

        setReviewForm({
          rating: 5,
          comment: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Review submission failed:', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Could not submit your review. Please try again.';

      setReviewError(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Report
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (submittingReport) return;

    setSubmittingReport(true);
    setReportError('');

    try {
      await reportApi.create({
        reportedListingId: id,
        reporterName: reportForm.reporterName.trim(),
        reporterPhone: reportForm.reporterPhone.trim(),
        reporterEmail: reportForm.reporterEmail.trim(),
        reason: reportForm.reason.trim(),
      });

      setReportSuccess(true);

      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);

        setReportForm({
          reporterName: '',
          reporterPhone: '',
          reporterEmail: '',
          reason: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Report submission failed:', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Could not submit this report. Please try again.';

      setReportError(message);
    } finally {
      setSubmittingReport(false);
    }
  };

  // Google Maps
  const openGoogleMaps = () => {
    if (listing.latitude != null && listing.longitude != null) {
      const url =
        `https://www.google.com/maps?q=` +
        `${encodeURIComponent(listing.latitude)},` +
        `${encodeURIComponent(listing.longitude)}`;

      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (listing.city || listing.quarter || listing.address) {
      const location = [
        listing.address,
        listing.quarter,
        listing.city,
        'Cameroon',
      ]
        .filter(Boolean)
        .join(', ');

      const url =
        `https://www.google.com/maps/search/?api=1&query=` +
        encodeURIComponent(location);

      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // WhatsApp
  const openWhatsApp = () => {
    if (!listing.businessPhone) return;

    let phone = listing.businessPhone.replace(/\D/g, '');

    // Cameroon local number:
    // 6XXXXXXXX -> 2376XXXXXXXX
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }

    // Add Cameroon country code when necessary
    if (!phone.startsWith('237')) {
      phone = `237${phone}`;
    }

    window.open(
      `https://wa.me/${phone}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <img
          src="/favicon.svg"
          alt="Marketplace"
          className="w-12 h-12 animate-pulse"
        />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertTriangle
            size={48}
            className="mx-auto text-red-500 mb-4"
          />

          <p className="text-gray-700 text-lg font-semibold">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Listing not found
  if (!listing) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          Listing not found.
        </p>
      </div>
    );
  }

  const images = Array.isArray(listing.images)
    ? listing.images.filter(Boolean)
    : [];

  const activeImage = images[selectedImage] || images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ==================== IMAGES ==================== */}
        <div>
          {images.length > 0 ? (
            <>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={activeImage}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${selectedImage === index
                          ? 'border-emerald-600'
                          : 'border-transparent'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${listing.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* ==================== DETAILS ==================== */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {listing.title}
          </h1>

          <p className="mt-4 text-3xl font-bold text-green-600">
            {Number(listing.price || 0).toLocaleString()}{' '}
            {listing.currency || 'XAF'}
          </p>

          {/* Status */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {listing.isAvailable ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Available
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                Reserved
              </span>
            )}

            {listing.categoryName && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {listing.categoryName}
              </span>
            )}
          </div>

          {/* ==================== LOCATION ==================== */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin
                size={18}
                className="text-emerald-600"
              />
              Location
            </h3>

            {listing.hasFixedLocation ? (
              <div className="mt-2">
                <p className="text-gray-600">
                  {listing.quarter && `${listing.quarter}, `}
                  {listing.city || 'Cameroon'}
                </p>

                {listing.address && (
                  <p className="mt-1 text-sm text-gray-500">
                    {listing.address}
                  </p>
                )}

                {(listing.latitude != null &&
                  listing.longitude != null) ||
                  listing.city ||
                  listing.quarter ||
                  listing.address ? (
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                  >
                    <MapPin size={16} />
                    View on Map
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="mt-2">
                <p className="text-gray-600">
                  Contact seller for location
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Delivery or WhatsApp arrangement
                </p>
              </div>
            )}
          </div>

          {/* ==================== DESCRIPTION ==================== */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">
              Description
            </h3>

            <p className="mt-2 text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description || 'No description provided.'}
            </p>
          </div>

          {/* ==================== SELLER ==================== */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900">
              Seller
            </h3>

            {listing.businessName && (
              <Link
                to={`/seller/${listing.businessId}`}
                className="mt-1 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
              >
                <Store size={16} />
                {listing.businessName}
              </Link>
            )}

            <div className="mt-4 flex flex-col gap-3">
              {listing.businessPhone && (
                <>
                  <a
                    href={`tel:${listing.businessPhone}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Phone size={16} />
                    {listing.businessPhone}
                  </a>

                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Chat on WhatsApp
                  </button>
                </>
              )}

              {listing.businessEmail && (
                <a
                  href={`mailto:${listing.businessEmail}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <Mail size={16} />
                  {listing.businessEmail}
                </a>
              )}
            </div>
          </div>

          {/* ==================== ACTIONS ==================== */}
          <div className="mt-8 space-y-3">
            {listing.isAvailable && (
              <button
                type="button"
                onClick={() => {
                  setReservationError('');
                  setShowReserveModal(true);
                }}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Reserve This Item
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setReviewError('');
                  setShowReviewModal(true);
                }}
                className="py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Star size={18} />
                Write Review
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportError('');
                  setShowReportModal(true);
                }}
                className="py-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <Flag size={18} />
                Report
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            {Number(listing.viewCount || 0).toLocaleString()} views
          </p>
        </div>
      </div>

      {/* ==================== REVIEWS ==================== */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews
          </h2>

          {reviews.length > 0 && (
            <span className="text-sm text-gray-500">
              {reviews.length}{' '}
              {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500 mt-4">
            No reviews yet. Be the first to review.
          </p>
        ) : (
          <div className="space-y-4 mt-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Number(review.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}

                  <span className="ml-2 text-sm font-bold text-gray-700">
                    {review.rating}/5
                  </span>
                </div>

                {review.comment && (
                  <p className="mt-2 text-gray-600 whitespace-pre-line">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          RESERVATION MODAL
      ========================================================= */}
      <AnimatePresence>
        {showReserveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeReserveModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeReserveModal}
                disabled={submitting}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-900 pr-8">
                Reserve This Item
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                This holds the item for 60 minutes.
              </p>

              {reservationSuccess ? (
                <div className="mt-6 text-center py-8">
                  <Check
                    size={40}
                    className="mx-auto text-green-600"
                  />

                  <p className="text-green-600 font-semibold text-lg mt-3">
                    Reservation successful!
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    The item has been reserved.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleReservationSubmit}
                  className="mt-6 space-y-4"
                >
                  {reservationError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      {reservationError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      disabled={submitting}
                      value={reservationForm.fullName}
                      onChange={(e) =>
                        setReservationForm({
                          ...reservationForm,
                          fullName: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      required
                      disabled={submitting}
                      value={reservationForm.phone}
                      onChange={(e) =>
                        setReservationForm({
                          ...reservationForm,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>

                    <input
                      type="email"
                      required
                      disabled={submitting}
                      value={reservationForm.email}
                      onChange={(e) =>
                        setReservationForm({
                          ...reservationForm,
                          email: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeReserveModal}
                      disabled={submitting}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {submitting
                        ? 'Reserving...'
                        : 'Confirm Reserve'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          REVIEW MODAL
      ========================================================= */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeReviewModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeReviewModal}
                disabled={submittingReview}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-900 pr-8">
                Write a Review
              </h2>

              {reviewSuccess ? (
                <div className="mt-6 text-center py-8">
                  <Check
                    size={40}
                    className="mx-auto text-green-600"
                  />

                  <p className="text-green-600 font-semibold text-lg mt-3">
                    Review submitted!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mt-6 space-y-4"
                >
                  {reviewError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={submittingReview}
                          onClick={() =>
                            setReviewForm({
                              ...reviewForm,
                              rating: star,
                            })
                          }
                          className="transition-transform hover:scale-110 disabled:opacity-50"
                          aria-label={`Rate ${star} out of 5`}
                        >
                          <Star
                            size={32}
                            className={
                              star <= reviewForm.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }
                          />
                        </button>
                      ))}

                      <span className="ml-3 text-sm font-bold text-gray-700">
                        {reviewForm.rating} / 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Comment
                    </label>

                    <textarea
                      value={reviewForm.comment}
                      disabled={submittingReview}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Share your experience..."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeReviewModal}
                      disabled={submittingReview}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {submittingReview
                        ? 'Submitting...'
                        : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          REPORT MODAL
      ========================================================= */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeReportModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeReportModal}
                disabled={submittingReport}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pr-8">
                <AlertTriangle
                  size={20}
                  className="text-red-600"
                />
                Report This Listing
              </h2>

              {reportSuccess ? (
                <div className="mt-6 text-center py-8">
                  <Check
                    size={40}
                    className="mx-auto text-green-600"
                  />

                  <p className="text-green-600 font-semibold text-lg mt-3">
                    Report submitted!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleReportSubmit}
                  className="mt-6 space-y-4"
                >
                  {reportError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      {reportError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your Name
                    </label>

                    <input
                      type="text"
                      required
                      disabled={submittingReport}
                      value={reportForm.reporterName}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          reporterName: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your Phone Number
                    </label>

                    <input
                      type="tel"
                      required
                      disabled={submittingReport}
                      value={reportForm.reporterPhone}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          reporterPhone: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your Email
                    </label>

                    <input
                      type="email"
                      required
                      disabled={submittingReport}
                      value={reportForm.reporterEmail}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          reporterEmail: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>

                    <textarea
                      required
                      disabled={submittingReport}
                      value={reportForm.reason}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          reason: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Tell us why you are reporting this listing..."
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={closeReportModal}
                      disabled={submittingReport}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingReport}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {submittingReport
                        ? 'Submitting...'
                        : 'Submit Report'}
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
