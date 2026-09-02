// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
// Import API
import { categoryApi, businessApi, listingApi } from '../services/api';
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
  Plus,
  MapPin,
  Store,
  Crosshair,
  X,
} from 'lucide-react';

// Seller create listing page
export default function SellerCreateListing() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [categories, setCategories] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [images, setImages] = useState([]);
  const [locationType, setLocationType] = useState('fixed');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 1,
    categoryId: '',
    availableQuantity: 1,
    isReservable: true,
    city: '',
    quarter: '',
    address: '',
    latitude: null,
    longitude: null,
  });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // Fetch categories and business
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, businessResponse] = await Promise.all([
          categoryApi.getAll(),
          businessApi.getMyBusinesses(),
        ]);

        setCategories(categoriesResponse.data);

        if (businessResponse.data && businessResponse.data.length > 0) {
          const biz = businessResponse.data[0];
          setBusinessId(biz.id || biz.businessId);
        } else {
          setError('No business found. Please contact admin to create your business profile.');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data. Please try again.');
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

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
      },
      (error) => {
        console.error('Failed to get location:', error);
        alert('Failed to get your location. Please enter manually or use map picker.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Handle map picker selection
  const handleMapSelect = (lat, lng) => {
    setForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setShowMapPicker(false);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    if (!businessId) {
      setError('No business found. Please contact admin.');
      setCreating(false);
      return;
    }

    if (!form.categoryId) {
      setError('Please select a category.');
      setCreating(false);
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price) || 0,
        type: form.type,
        businessId: businessId,
        categoryId: form.categoryId,
        availableQuantity: parseInt(form.availableQuantity) || 1,
        isReservable: form.isReservable,
        images: images,
        city: locationType === 'fixed' ? form.city : null,
        quarter: locationType === 'fixed' ? form.quarter : null,
        address: locationType === 'fixed' ? form.address : null,
        hasFixedLocation: locationType === 'fixed',
        latitude: form.latitude,
        longitude: form.longitude,
      };

      await listingApi.create(payload);
      navigate('/studio/listings');
    } catch (err) {
      console.error('Failed to create listing:', err);
      setError(
        err.response?.data?.errors?.request?.[0] ||
        err.response?.data?.message ||
        'Failed to create listing'
      );
    } finally {
      setCreating(false);
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Create Listing</h1>
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
              </div>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Studio</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">New Listing</h2>
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

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Listing Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((prev) => ({ ...prev, type: parseInt(e.target.value) }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value={1}>Product</option>
                    <option value={2}>Property</option>
                    <option value={3}>Vehicle</option>
                    <option value={4}>Service</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.availableQuantity}
                    onChange={(e) => setForm((prev) => ({ ...prev, availableQuantity: parseInt(e.target.value) }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* LOCATION TYPE */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Location Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setLocationType('fixed')}
                      className={`flex-1 h-12 rounded-xl border text-sm font-bold transition ${
                        locationType === 'fixed'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <MapPin size={16} />
                        Fixed Location
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationType('flexible')}
                      className={`flex-1 h-12 rounded-xl border text-sm font-bold transition ${
                        locationType === 'flexible'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Store size={16} />
                        WhatsApp / Delivery
                      </span>
                    </button>
                  </div>
                </div>

                {/* FIXED LOCATION FIELDS */}
                {locationType === 'fixed' && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-gray-700">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="Example: Douala"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-gray-700">Quarter / Neighborhood</label>
                      <input
                        type="text"
                        value={form.quarter}
                        onChange={(e) => setForm((prev) => ({ ...prev, quarter: e.target.value }))}
                        placeholder="Example: Bonapriso"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-bold text-gray-700">Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Street address or landmark"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* GPS COORDINATES */}
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-bold text-gray-700">
                        GPS Coordinates
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={gettingLocation}
                          className="flex-1 h-12 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Crosshair size={16} />
                          {gettingLocation ? 'Getting location...' : 'Use My Current Location'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMapPicker(true)}
                          className="flex-1 h-12 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <MapPin size={16} />
                          Pick on Map
                        </button>
                      </div>

                      {form.latitude && form.longitude && (
                        <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                          <MapPin size={18} className="text-emerald-600" />
                          <p className="text-sm font-semibold text-emerald-700">
                            {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, latitude: null, longitude: null }))}
                            className="ml-auto text-emerald-600 hover:text-emerald-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* IMAGE UPLOAD */}
                <div className="sm:col-span-2">
                  <ImageUpload images={images} setImages={setImages} maxImages={5} />
                </div>

                {/* DESCRIPTION */}
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
                      checked={form.isReservable}
                      onChange={(e) => setForm((prev) => ({ ...prev, isReservable: e.target.checked }))}
                      className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      Allow buyers to reserve this item
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
                  disabled={creating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:opacity-60"
                >
                  <Plus size={18} />
                  {creating ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* MAP PICKER MODAL */}
      {showMapPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setShowMapPicker(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">Pick Location on Map</h2>
              <button
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Click anywhere on the map to set your location. Default is Douala, Cameroon.
            </p>

            <div className="relative overflow-hidden rounded-xl border border-gray-200">
              <iframe
                title="Map Picker"
                src="https://www.google.com/maps?q=Douala,Cameroon&output=embed"
                className="h-[400px] w-full"
                loading="lazy"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => handleMapSelect(4.0511, 9.7679)}
                className="flex-1 rounded-xl bg-[#103c2d] px-5 py-3 text-sm font-bold text-white hover:bg-[#174d3a]"
              >
                Use Douala Center
              </button>
              <button
                type="button"
                onClick={() => handleMapSelect(3.8667, 11.5167)}
                className="flex-1 rounded-xl bg-[#103c2d] px-5 py-3 text-sm font-bold text-white hover:bg-[#174d3a]"
              >
                Use Yaounde Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}