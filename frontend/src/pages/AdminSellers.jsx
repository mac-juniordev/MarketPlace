// Import React hooks
import { useEffect, useMemo, useState } from 'react';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
// Import API
import { adminApi } from '../services/api';
// Import icons
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Flag,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  X,
  UserPlus,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Pause,
  Play,
  Trash2,
} from 'lucide-react';

// Initial seller form state
const INITIAL_SELLER = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  businessName: '',
  businessDescription: '',
};

// Admin sellers page
export default function AdminSellers() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [sellers, setSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSeller, setNewSeller] = useState(INITIAL_SELLER);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/control', { replace: true });
    }
  }, [navigate]);

  // Fetch sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await adminApi.getSellers();
        setSellers(response.data);
      } catch (error) {
        console.error('Failed to fetch sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
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
    navigate('/control', { replace: true });
  };

  // Search
  const filteredSellers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sellers;

    return sellers.filter((seller) => {
      const searchableText = [
        seller.firstName,
        seller.lastName,
        seller.email,
        seller.businessName,
        seller.phoneNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [sellers, searchQuery]);

  // Create seller
  const handleCreateSeller = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await adminApi.createSeller(newSeller);
      setSellers((prev) => [...prev, response.data]);
      setShowCreateModal(false);
      setNewSeller(INITIAL_SELLER);
    } catch (error) {
      console.error('Failed to create seller:', error);
      alert(error.response?.data?.message || 'Failed to create seller');
    } finally {
      setCreating(false);
    }
  };

  // Suspend seller
  const handleSuspend = async (sellerId) => {
    try {
      const response = await adminApi.suspendSeller(sellerId);
      setSellers((prev) =>
        prev.map((s) =>
          s.id === sellerId ? { ...s, isActive: response.data.isActive } : s
        )
      );
    } catch (error) {
      console.error('Failed to suspend seller:', error);
      alert('Failed to suspend seller');
    }
  };

  // Delete seller
  const handleDelete = async (sellerId) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) {
      return;
    }

    try {
      await adminApi.deleteSeller(sellerId);
      setSellers((prev) => prev.filter((s) => s.id !== sellerId));
    } catch (error) {
      console.error('Failed to delete seller:', error);
      alert('Failed to delete seller');
    }
  };

  // Close modal
  const closeCreateModal = () => {
    if (creating) return;
    setShowCreateModal(false);
    setNewSeller(INITIAL_SELLER);
  };

  // Navigation
  const navItems = [
    { label: 'Dashboard', path: '/control/dashboard', icon: LayoutDashboard },
    { label: 'Sellers', path: '/control/sellers', icon: Users, active: true },
    { label: 'Categories', path: '/control/categories', icon: FolderOpen },
    { label: 'Reports', path: '/control/reports', icon: Flag },
    { label: 'Audit Logs', path: '/control/audit-logs', icon: ScrollText },
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
                <p className="font-bold leading-tight text-white">Admin Panel</p>
                <p className="mt-0.5 text-xs text-white/50">Marketplace Control</p>
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Sellers</h1>
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Marketplace</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Seller Management</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              View, manage and monitor seller accounts on the marketplace.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total sellers</p>
                  <p className="mt-2 text-3xl font-black text-gray-950">{sellers.length}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Users size={21} className="text-emerald-700" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active accounts</p>
                  <p className="mt-2 text-3xl font-black text-gray-950">
                    {sellers.filter((s) => s.isActive).length}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                  <ShieldCheck size={21} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Search results</p>
                  <p className="mt-2 text-3xl font-black text-gray-950">{filteredSellers.length}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
                  <Search size={21} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or business..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-5 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-[#174d3a] active:translate-y-0"
            >
              <Plus size={18} />
              Create Seller
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Seller</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Contact</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Business</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Status</th>
                    <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                            <Users size={28} className="text-gray-400" />
                          </div>
                          <h3 className="mt-5 font-bold text-gray-800">
                            {searchQuery ? 'No sellers found' : 'No sellers yet'}
                          </h3>
                          <p className="mt-1 max-w-sm text-sm leading-6 text-gray-400">
                            {searchQuery
                              ? 'Try a different name, email address or business name.'
                              : 'Seller accounts will appear here once they are created.'}
                          </p>
                          {!searchQuery && (
                            <button
                              type="button"
                              onClick={() => setShowCreateModal(true)}
                              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                            >
                              <Plus size={17} />
                              Create first seller
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSellers.map((seller, index) => {
                      const fullName =
                        `${seller.firstName || ''} ${seller.lastName || ''}`.trim() ||
                        'Unnamed seller';

                      const initials =
                        `${seller.firstName?.charAt(0) || ''}${seller.lastName?.charAt(0) || ''}`.toUpperCase() ||
                        'S';

                      return (
                        <motion.tr
                          key={seller.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: index * 0.03 }}
                          className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70"
                        >
                          {/* Seller */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-800">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-bold text-gray-900">{fullName}</p>
                                <p className="mt-0.5 text-xs text-gray-400">Seller account</p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{seller.email || '-'}</span>
                              </div>
                              {seller.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone size={13} className="text-gray-400" />
                                  <span className="text-xs text-gray-400">{seller.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Business */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Building2 size={16} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {seller.businessName || '-'}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {seller.isActive ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                Suspended
                              </span>
                            )}
                          </td>

                          {/* Actions - inline buttons */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleSuspend(seller.id)}
                                title={seller.isActive ? 'Suspend seller' : 'Activate seller'}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                              >
                                {seller.isActive ? <Pause size={17} /> : <Play size={17} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(seller.id)}
                                title="Delete seller"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* CREATE SELLER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Close modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCreateModal}
              className="absolute inset-0 cursor-default bg-gray-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <UserPlus size={22} className="text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-950">Create seller account</h2>
                    <p className="mt-1 text-sm text-gray-500">Add a new seller and business profile.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleCreateSeller} className="max-h-[calc(100vh-180px)] overflow-y-auto">
                <div className="space-y-6 p-6 sm:p-7">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-black text-gray-900">Personal information</h3>
                      <p className="mt-1 text-xs text-gray-400">Basic information for the seller account.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="First name"
                        required
                        value={newSeller.firstName}
                        onChange={(value) => setNewSeller((prev) => ({ ...prev, firstName: value }))}
                        placeholder="John"
                      />
                      <FormField
                        label="Last name"
                        required
                        value={newSeller.lastName}
                        onChange={(value) => setNewSeller((prev) => ({ ...prev, lastName: value }))}
                        placeholder="Doe"
                      />
                      <FormField
                        label="Email address"
                        type="email"
                        required
                        value={newSeller.email}
                        onChange={(value) => setNewSeller((prev) => ({ ...prev, email: value }))}
                        placeholder="seller@example.com"
                      />
                      <FormField
                        label="Phone number"
                        type="tel"
                        value={newSeller.phoneNumber}
                        onChange={(value) => setNewSeller((prev) => ({ ...prev, phoneNumber: value }))}
                        placeholder="+237 6XX XXX XXX"
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Password"
                          type="password"
                          required
                          value={newSeller.password}
                          onChange={(value) => setNewSeller((prev) => ({ ...prev, password: value }))}
                          placeholder="Create a secure password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-black text-gray-900">Business information</h3>
                      <p className="mt-1 text-xs text-gray-400">Details customers will associate with this seller.</p>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        label="Business name"
                        required
                        value={newSeller.businessName}
                        onChange={(value) => setNewSeller((prev) => ({ ...prev, businessName: value }))}
                        placeholder="Example Business"
                      />
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">Business description</label>
                        <textarea
                          value={newSeller.businessDescription}
                          onChange={(e) => setNewSeller((prev) => ({ ...prev, businessDescription: e.target.value }))}
                          rows={4}
                          placeholder="Briefly describe the business..."
                          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={creating}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#174d3a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating seller...
                      </>
                    ) : (
                      <>
                        <UserPlus size={17} />
                        Create Seller
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Form field component
function FormField({ label, type = 'text', required = false, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </div>
  );
}