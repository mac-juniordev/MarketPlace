// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import router
import { useLocation, useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
  Bell,
  Check,
  AlertTriangle,
  X,
  Package,
  ShoppingCart,
  Building2,
  FileWarning,
} from 'lucide-react';
// Import charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Enable Day.js relative time
dayjs.extend(relativeTime);

// Chart colors
const COLORS = ['#103c2d', '#16a34a', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6'];

// Notification data
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'seller_action',
    title: 'New listing created',
    message: 'Seller "Douala Fashion" created a new listing',
    time: dayjs().subtract(5, 'minute').toISOString(),
    read: false,
  },
  {
    id: 2,
    type: 'seller_action',
    title: 'New reservation',
    message: 'Buyer reserved "iPhone 13 Pro"',
    time: dayjs().subtract(12, 'minute').toISOString(),
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Report submitted',
    message: 'A listing was reported for review',
    time: dayjs().subtract(1, 'hour').toISOString(),
    read: false,
  },
];

// Admin dashboard page
export default function AdminDashboard() {
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => dayjs());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/control', { replace: true });
    }
  }, [navigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
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

  // Greeting
  const getGreeting = () => {
    const hour = currentTime.hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Navigation
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/control/dashboard', icon: LayoutDashboard },
    { label: 'Sellers', path: '/control/sellers', icon: Users },
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
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                  active
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

        {/* Sidebar footer */}
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {getGreeting()}, Admin
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentTime.format('dddd, DD MMMM YYYY')}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Clock */}
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

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications((prev) => !prev)}
                  aria-label="Open notifications"
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 hover:shadow-sm"
                >
                  <Bell size={21} className="text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          <p className="mt-0.5 text-xs text-gray-400">{unreadCount} unread</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={markAllAsRead}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowNotifications(false)}
                            aria-label="Close notifications"
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[420px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-6 py-12 text-center">
                            <Bell size={28} className="mx-auto text-gray-300" />
                            <p className="mt-3 text-sm font-medium text-gray-500">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => markAsRead(notification.id)}
                              className={`flex w-full items-start gap-3 border-b border-gray-50 p-4 text-left transition-colors hover:bg-gray-50 ${
                                !notification.read ? 'bg-emerald-50/40' : 'bg-white'
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                  notification.type === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'
                                }`}
                              >
                                {notification.type === 'warning' ? (
                                  <AlertTriangle size={18} className="text-amber-600" />
                                ) : (
                                  <Check size={18} className="text-emerald-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                                <p className="mt-1 text-sm leading-5 text-gray-500">{notification.message}</p>
                                <p className="mt-2 text-xs text-gray-400">
                                  {dayjs(notification.time).fromNow()}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="p-5 sm:p-8">
          {/* Page intro */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Overview</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Marketplace Dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor sellers, listings and reservations from your marketplace administration panel.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Sellers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sellers</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {stats?.totalSellers ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Registered sellers</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Users size={22} className="text-emerald-700" />
                </div>
              </div>
            </motion.div>

            {/* Listings */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Listings</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {stats?.totalListings ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Active listings</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Package size={22} className="text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Reservations */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Reservations</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {stats?.activeReservations ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Currently reserved</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">
                  <ShoppingCart size={22} className="text-yellow-600" />
                </div>
              </div>
            </motion.div>

            {/* Pending Reports */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                  <p className="mt-3 text-3xl font-black text-gray-900">
                    {stats?.pendingReports ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Requires review</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <FileWarning size={22} className="text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* CHARTS */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* Listings by Category */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-gray-900">Listings by Category</h3>
              <p className="mt-1 text-sm text-gray-500">Distribution across categories</p>

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.listingsByCategory || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#103c2d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Listings by Type */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-gray-900">Listings by Type</h3>
              <p className="mt-1 text-sm text-gray-500">Product, property, vehicle, service</p>

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.listingsByType || []}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.type}
                    >
                      {(stats?.listingsByType || []).map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* Recent Sellers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-gray-900">Recent Sellers</h3>
              <p className="mt-1 text-sm text-gray-500">Latest seller registrations</p>

              <div className="mt-4 space-y-3">
                {(stats?.recentSellers || []).length === 0 ? (
                  <p className="text-sm text-gray-400 py-8 text-center">No sellers yet</p>
                ) : (
                  (stats?.recentSellers || []).map((seller) => (
                    <div key={seller.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                        {(seller.firstName?.charAt(0) || '') + (seller.lastName?.charAt(0) || '')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {seller.firstName} {seller.lastName}
                        </p>
                        <p className="truncate text-xs text-gray-400">{seller.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{dayjs(seller.createdAt).fromNow()}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Recent Listings */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.54 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-gray-900">Recent Listings</h3>
              <p className="mt-1 text-sm text-gray-500">Latest marketplace listings</p>

              <div className="mt-4 space-y-3">
                {(stats?.recentListings || []).length === 0 ? (
                  <p className="text-sm text-gray-400 py-8 text-center">No listings yet</p>
                ) : (
                  (stats?.recentListings || []).map((listing) => (
                    <div key={listing.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Package size={18} className="text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">{listing.title}</p>
                        <p className="truncate text-xs text-gray-400">{listing.businessName}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        {listing.price.toLocaleString()} XAF
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}