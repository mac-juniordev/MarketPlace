// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import router
import { useNavigate, useParams } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
// Import API
import { categoryApi, listingApi } from '../services/api';
// Import components
import ImageUpload from '../components/ImageUpload';
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
  Save,
} from 'lucide-react';

// Seller edit listing page
export default function SellerEditListing() {
  // Navigation hook
  const navigate = useNavigate();
  // Get listing ID from URL
  const { id } = useParams();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 1,
    categoryId: '',
    isAvailable: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // Fetch listing and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingResponse, categoriesResponse] = await Promise.all([
          listingApi.getById(id),
          categoryApi.getAll(),
        ]);

        const listing = listingResponse.data;
        setForm({
          title: listing.title || '',
          description: listing.description || '',
          price: listing.price?.toString() || '',
          type: listing.type || 1,
          categoryId: listing.categoryId || '',
          isAvailable: listing.isAvailable ?? true,
        });
        setImages(listing.images || []);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        status: form.isAvailable ? 1 : 3,
        categoryId: form.categoryId,
        isAvailable: form.isAvailable,
      };

      await listingApi.update(id, payload);
      navigate('/studio/listings');
    } catch (err) {
      console.error('Failed to update listing:', err);
      setError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8f7f3] items-center justify-center">
        <img src="/favicon.svg" alt="Marketplace" className="w-12 h-12 animate-pulse" />
      </div>
    );
  }

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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Edit Listing</h1>
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
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Edit Listing</h2>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-3xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Price (XAF) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload images={images} setImages={setImages} maxImages={5} />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Available for reservation
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/studio/listings')}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}