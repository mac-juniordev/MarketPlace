import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  reservationApi,
  listingApi,
  businessApi,
} from '../services/api';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Timer,
  RefreshCw,
} from 'lucide-react';

dayjs.extend(relativeTime);

export default function SellerReservations() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());

  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // =========================================================
  // FETCH RESERVATIONS
  // =========================================================

  const fetchReservations = async (showRefresh = false) => {
    try {
      setError('');

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get seller businesses
      const businessResponse = await businessApi.getMyBusinesses();

      const businesses = Array.isArray(businessResponse.data)
        ? businessResponse.data
        : [];

      if (businesses.length === 0) {
        setReservations([]);
        return;
      }

      // Currently use the first business
      const business = businesses[0];

      // Get listings
      const listingsResponse = await listingApi.getByBusiness(
        business.id
      );

      const listings = Array.isArray(listingsResponse.data)
        ? listingsResponse.data
        : [];

      if (listings.length === 0) {
        setReservations([]);
        return;
      }

      // Fetch reservations for all listings in parallel
      const reservationResults = await Promise.all(
        listings.map(async (listing) => {
          try {
            const response =
              await reservationApi.getByListing(listing.id);

            const listingReservations = Array.isArray(response.data)
              ? response.data
              : [];

            return listingReservations.map((reservation) => ({
              ...reservation,

              // Attach listing information
              listingId: listing.id,
              listingTitle: listing.title,

              // Keep buyer field names consistent
              buyerName:
                reservation.buyerName ||
                reservation.userName ||
                reservation.name ||
                '',

              buyerPhone:
                reservation.buyerPhone ||
                reservation.phoneNumber ||
                reservation.phone ||
                '',

              buyerEmail:
                reservation.buyerEmail ||
                reservation.email ||
                '',
            }));
          } catch (err) {
            console.error(
              `Failed to fetch reservations for listing ${listing.id}:`,
              err
            );

            return [];
          }
        })
      );

      const allReservations = reservationResults.flat();

      // Sort newest first
      allReservations.sort((a, b) => {
        const dateA = dayjs(
          a.createdAt || a.reservedAt || a.created_at
        ).valueOf();

        const dateB = dayjs(
          b.createdAt || b.reservedAt || b.created_at
        ).valueOf();

        return dateB - dateA;
      });

      setReservations(allReservations);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);

      setError(
        err?.response?.data?.message ||
          'Failed to load reservations. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchReservations();
    }
  }, []);

  // =========================================================
  // LIVE CLOCK
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // AUTO-UPDATE EXPIRED RESERVATIONS LOCALLY
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setReservations((previousReservations) =>
        previousReservations.map((reservation) => {
          const status = normalizeStatus(reservation.status);

          if (
            status === 'Active' &&
            reservation.expiresAt &&
            dayjs(reservation.expiresAt).isBefore(dayjs())
          ) {
            return {
              ...reservation,
              status: 'Expired',
            };
          }

          return reservation;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/studio', { replace: true });
  };

  // =========================================================
  // STATUS HELPERS
  // =========================================================

  function normalizeStatus(status) {
    if (
      status === 1 ||
      String(status).toLowerCase() === 'active'
    ) {
      return 'Active';
    }

    if (
      status === 2 ||
      String(status).toLowerCase() === 'expired'
    ) {
      return 'Expired';
    }

    if (
      status === 3 ||
      String(status).toLowerCase() === 'cancelled' ||
      String(status).toLowerCase() === 'canceled'
    ) {
      return 'Cancelled';
    }

    if (
      status === 4 ||
      String(status).toLowerCase() === 'completed'
    ) {
      return 'Completed';
    }

    return status || 'Unknown';
  }

  const getStatusBadge = (status) => {
    const normalizedStatus = normalizeStatus(status);

    switch (normalizedStatus) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
          </span>
        );

      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500">
            <XCircle size={13} />
            Expired
          </span>
        );

      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
            <XCircle size={13} />
            Cancelled
          </span>
        );

      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <CheckCircle size={13} />
            Completed
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-500">
            {normalizedStatus}
          </span>
        );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredReservations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return reservations;
    }

    return reservations.filter((reservation) => {
      const searchableText = [
        reservation.listingTitle,
        reservation.buyerName,
        reservation.buyerPhone,
        reservation.buyerEmail,
        reservation.userName,
        reservation.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [reservations, searchQuery]);

  // =========================================================
  // COMPLETE RESERVATION
  // =========================================================

  const handleComplete = async (reservationId) => {
    const reservation = reservations.find(
      (item) => item.id === reservationId
    );

    if (!reservation) {
      return;
    }

    const currentStatus = normalizeStatus(reservation.status);

    if (currentStatus !== 'Active') {
      return;
    }

    try {
      /*
       * IMPORTANT:
       *
       * Replace this with your real backend endpoint when available:
       *
       * await reservationApi.complete(reservationId);
       *
       * For now we update the UI locally.
       */

      setReservations((previousReservations) =>
        previousReservations.map((item) =>
          item.id === reservationId
            ? {
                ...item,
                status: 'Completed',
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        'Failed to complete reservation:',
        err
      );
    }
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navItems = [
    {
      label: 'Dashboard',
      path: '/studio/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'My Listings',
      path: '/studio/listings',
      icon: Package,
    },
    {
      label: 'Reservations',
      path: '/studio/reservations',
      icon: ShoppingCart,
      active: true,
    },
    {
      label: 'Reviews',
      path: '/studio/reviews',
      icon: Star,
    },
    {
      label: 'Premium',
      path: '/studio/premium',
      icon: Settings,
    },
    {
      label: 'Report Issue',
      path: '/studio/reports',
      icon: Settings,
    },
  ];

  // =========================================================
  // RESERVATION TIME
  // =========================================================

  const getExpirationText = (reservation) => {
    if (!reservation.expiresAt) {
      return 'Expiration time unavailable';
    }

    const expiration = dayjs(reservation.expiresAt);

    if (!expiration.isValid()) {
      return 'Expiration time unavailable';
    }

    if (expiration.isBefore(currentTime)) {
      return 'Reservation expired';
    }

    return `Expires ${expiration.fromNow()}`;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#103c2d] shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="Marketplace"
                className="h-9 w-9"
              />

              <div>
                <p className="font-bold leading-tight text-white">
                  Seller Studio
                </p>

                <p className="mt-0.5 text-xs text-white/50">
                  Business Management
                </p>
              </div>
            </div>
          ) : (
            <img
              src="/favicon.svg"
              alt="Marketplace"
              className="mx-auto h-9 w-9"
            />
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                  item.active
                    ? 'bg-yellow-400 font-semibold text-gray-950 shadow-lg shadow-yellow-900/10'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                } ${
                  !sidebarOpen ? 'justify-center' : ''
                }`}
              >
                <Icon size={20} />

                {sidebarOpen && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => navigate('/studio/profile')}
            title={
              !sidebarOpen
                ? 'Profile Settings'
                : undefined
            }
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/75 transition-colors hover:bg-white/10 hover:text-white ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <Settings size={20} />

            {sidebarOpen && (
              <span>Profile Settings</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />

            {sidebarOpen && (
              <span className="font-medium">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* =====================================================
          SIDEBAR TOGGLE
      ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setSidebarOpen((previous) => !previous)
        }
        aria-label={
          sidebarOpen
            ? 'Collapse sidebar'
            : 'Expand sidebar'
        }
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#103c2d] text-white shadow-lg transition-all duration-300 hover:bg-[#1a5c42] ${
          sidebarOpen
            ? 'left-[15rem]'
            : 'left-14'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                Reservations
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {currentTime.format(
                  'dddd, DD MMMM YYYY'
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchReservations(true)}
                disabled={refreshing}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                title="Refresh reservations"
              >
                <RefreshCw
                  size={18}
                  className={
                    refreshing
                      ? 'animate-spin'
                      : ''
                  }
                />
              </button>

              <div className="hidden items-center gap-4 rounded-xl bg-[#103c2d] px-5 py-3 sm:flex">
                <Clock
                  size={22}
                  className="text-yellow-400"
                />

                <div>
                  <p className="font-mono text-xl font-bold text-yellow-400">
                    {currentTime.format(
                      'HH:mm:ss'
                    )}
                  </p>

                  <p className="mt-0.5 text-center text-[10px] text-white/60">
                    {currentTime.format(
                      'DD/MM/YYYY'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        ==================================================== */}

        <main className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Studio
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
              Reservations
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track who reserved your items and manage
              their status.
            </p>
          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <div className="mb-5">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search reservations..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>

              <button
                type="button"
                onClick={() => fetchReservations(true)}
                className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <img
                src="/favicon.svg"
                alt="Marketplace"
                className="h-12 w-12 animate-pulse"
              />
            </div>
          ) : filteredReservations.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================== */

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <ShoppingCart
                  size={28}
                  className="text-gray-400"
                />
              </div>

              <h3 className="mt-5 font-bold text-gray-800">
                No reservations found
              </h3>

              <p className="mt-1 px-4 text-sm text-gray-400">
                {searchQuery
                  ? 'Try a different search term.'
                  : 'Reservations will appear here when customers reserve your items.'}
              </p>
            </div>
          ) : (
            /* =================================================
               RESERVATIONS
            ================================================== */

            <div className="space-y-4">
              {filteredReservations.map(
                (reservation, index) => {
                  const status = normalizeStatus(
                    reservation.status
                  );

                  const buyerName =
                    reservation.buyerName ||
                    reservation.userName ||
                    'Customer';

                  const buyerPhone =
                    reservation.buyerPhone ||
                    reservation.phoneNumber ||
                    reservation.phone ||
                    '';

                  const buyerEmail =
                    reservation.buyerEmail ||
                    reservation.email ||
                    '';

                  return (
                    <motion.div
                      key={
                        reservation.id ||
                        `${reservation.listingId}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.04,
                      }}
                      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      {/* TOP */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900">
                            {reservation.listingTitle ||
                              'Listing'}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Reserved by {buyerName}
                          </p>

                          {reservation.expiresAt && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                              <Timer size={13} />

                              <span
                                className={
                                  status ===
                                    'Expired'
                                    ? 'font-semibold text-red-500'
                                    : ''
                                }
                              >
                                {getExpirationText(
                                  reservation
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* STATUS + COMPLETE */}
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(
                            reservation.status
                          )}

                          {status === 'Active' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleComplete(
                                  reservation.id
                                )
                              }
                              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                            >
                              <CheckCircle
                                size={16}
                              />
                              Complete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* =================================================
                          BUYER CONTACT INFORMATION
                          IMPORTANT: THIS IS INSIDE THE MAP CALLBACK
                      ================================================== */}

                      {(buyerPhone ||
                        buyerEmail) && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                            Customer Contact
                          </p>

                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            {buyerPhone && (
                              <a
                                href={`tel:${buyerPhone}`}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
                              >
                                <Phone
                                  size={14}
                                  className="text-emerald-600"
                                />

                                {buyerPhone}
                              </a>
                            )}

                            {buyerEmail && (
                              <a
                                href={`mailto:${buyerEmail}`}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
                              >
                                <Mail
                                  size={14}
                                  className="text-emerald-600"
                                />

                                {buyerEmail}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* RESERVATION DETAILS */}
                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Reservation ID
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                            {reservation.id ||
                              'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Created
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {reservation.createdAt &&
                            dayjs(
                              reservation.createdAt
                            ).isValid()
                              ? dayjs(
                                  reservation.createdAt
                                ).format(
                                  'DD MMM YYYY, HH:mm'
                                )
                              : 'N/A'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-400">
                            Status
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-700">
                            {status}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
