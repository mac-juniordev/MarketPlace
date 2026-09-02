// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// Import API
import { reviewApi, listingApi, businessApi } from '../services/api';
// Import icons
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
} from 'lucide-react';

// Enable relative time
dayjs.extend(relativeTime);

// Seller reviews page
export default function SellerReviews() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const businessResponse = await businessApi.getMyBusinesses();
        if (businessResponse.data && businessResponse.data.length > 0) {
          const biz = businessResponse.data[0];
          const listingsResponse = await listingApi.getByBusiness(biz.id);
          const listings = listingsResponse.data;

          const allReviews = [];
          for (const listing of listings) {
            try {
              const reviewsResponse = await reviewApi.getByListing(listing.id);
              allReviews.push(...reviewsResponse.data.map((r) => ({
                ...r,
                listingTitle: listing.title,
              })));
            } catch (err) {
              console.error('Failed to fetch reviews:', err);
            }
          }

          setReviews(allReviews);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/studio', { replace: true });
  };

  // Navigation
  const navItems = [
    { label: 'Dashboard', path: '/studio/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/studio/listings', icon: Package },
    { label: 'Reservations', path: '/studio/reservations', icon: ShoppingCart },
    { label: 'Reviews', path: '/studio/reviews', icon: Star, active: true },
    { label: 'Premium', path: '/studio/premium', icon: Settings },
    { label: 'Report Issue', path: '/studio/reports', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#103c2d] shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="Marketplace" className="h-9 w-9" />
              <div>
                <p className="font-bold leading-tight text-white">Seller Studio</p>
                <p className="mt-0.5 text-xs text-white/50">Business Management</p>
              </div>
            </div>
          ) : (
            <img src="/favicon.svg" alt="Marketplace" className="mx-auto h-9 w-9" />
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
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => navigate('/studio/profile')}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/75 transition-colors hover:bg-white/10 hover:text-white ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Profile Settings</span>}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* SIDEBAR TOGGLE */}
      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#103c2d] text-white shadow-lg transition-all duration-300 hover:bg-[#1a5c42] ${
          sidebarOpen ? 'left-[15rem]' : 'left-14'
        }`}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* MAIN AREA */}
      <div className={`min-w-0 flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Reviews</h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentTime.format('dddd, DD MMMM YYYY')}
              </p>
            </div>

            <div className="hidden items-center gap-4 rounded-xl bg-[#103c2d] px-5 py-3 sm:flex">
              <Clock size={22} className="text-yellow-400" />
              <div>
                <p className="font-mono text-xl font-bold text-yellow-400">
                  {currentTime.format('HH:mm:ss')}
                </p>
                <p className="mt-0.5 text-center text-[10px] text-white/60">
                  {currentTime.format('DD/MM/YYYY')}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Studio</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Customer Reviews</h2>
            <p className="mt-2 text-sm text-gray-500">
              See what customers are saying about your listings.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <img src="/favicon.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
                <Star size={28} className="text-gray-400" />
              </div>
              <h3 className="mt-5 font-bold text-gray-800">No reviews yet</h3>
              <p className="mt-1 text-sm text-gray-400">
                Reviews will appear here when customers review your listings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{review.listingTitle}</p>
                      <div className="mt-2 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {dayjs(review.createdAt).fromNow()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm text-gray-600 leading-6">
                      {review.comment}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}