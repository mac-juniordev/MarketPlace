// Import React hooks
import { useEffect, useMemo, useState } from 'react';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// Import API
import { listingApi, businessApi } from '../services/api';
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
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Enable relative time
dayjs.extend(relativeTime);

// Seller listings page
export default function SellerListings() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // Fetch business and listings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get business first
        const businessResponse = await businessApi.getMyBusinesses();
        if (businessResponse.data && businessResponse.data.length > 0) {
          const biz = businessResponse.data[0];
          setBusinessId(biz.id);

          // Get listings for this business
          const listingsResponse = await listingApi.getByBusiness(biz.id);
          setListings(listingsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Search
  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return listings;

    return listings.filter((listing) => {
      const searchableText = [
        listing.title,
        listing.description,
        listing.categoryName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [listings, searchQuery]);

  // Delete listing
  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingApi.delete(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing');
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (listing) => {
    try {
      const updatedData = {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        status: listing.status,
        categoryId: listing.categoryId,
        isAvailable: !listing.isAvailable,
      };

      await listingApi.update(listing.id, updatedData);
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id ? { ...l, isAvailable: !l.isAvailable } : l
        )
      );
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('Failed to update listing');
    }
  };

  // Navigation
  const navItems = [
    { label: 'Dashboard', path: '/studio/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/studio/listings', icon: Package, active: true },
    { label: 'Reservations', path: '/studio/reservations', icon: ShoppingCart },
    { label: 'Reviews', path: '/studio/reviews', icon: Star },
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
            title={!sidebarOpen ? 'Profile Settings' : undefined}
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
            title={!sidebarOpen ? 'Sign Out' : undefined}
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
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#103c2d] text-white shadow-lg transition-all duration-300 hover:bg-[#1a5c42] ${
          sidebarOpen ? 'left-[15rem]' : 'left-14'
        }`}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* MAIN AREA */}
      <div className={`min-w-0 flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">My Listings</h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentTime.format('dddd, DD MMMM YYYY')}
              </p>
            </div>

            <div className="flex items-center gap-4">
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
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-5 sm:p-8">
          {/* Page heading */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Studio</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Your Listings</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage all your marketplace listings from one place.
            </p>
          </div>

          {/* TOOLBAR */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your listings..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/studio/listings/create')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-[#174d3a] active:translate-y-0"
            >
              <Plus size={18} />
              Create Listing
            </button>
          </div>

          {/* LISTINGS GRID */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <img src="/favicon.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
                <Package size={28} className="text-gray-400" />
              </div>
              <h3 className="mt-5 font-bold text-gray-800">No listings found</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchQuery ? 'Try a different search term.' : 'Create your first listing to get started.'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => navigate('/studio/listings/create')}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                >
                  <Plus size={17} />
                  Create first listing
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-gray-900">{listing.title}</h3>
                      <p className="mt-1 text-lg font-black text-emerald-600">
                        {listing.price.toLocaleString()} {listing.currency || 'XAF'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(listing)}
                        title={listing.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          listing.isAvailable
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {listing.isAvailable ? <CheckCircle size={17} /> : <XCircle size={17} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/studio/listings/edit/${listing.id}`)}
                        title="Edit listing"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(listing.id)}
                        title="Delete listing"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {listing.categoryName}
                    </span>
                    {listing.isAvailable ? (
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full font-semibold">
                        Unavailable
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      {listing.viewCount} views
                    </span>
                    <span>{dayjs(listing.createdAt).fromNow()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}