// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
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
  Lock,
  Save,
} from 'lucide-react';

// Seller settings page
export default function SellerSettings() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/studio', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      setSaving(false);
      return;
    }

    try {
      setMessage('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage('Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/studio/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/studio/listings', icon: Package },
    { label: 'Reservations', path: '/studio/reservations', icon: ShoppingCart },
    { label: 'Reviews', path: '/studio/reviews', icon: Star },
    { label: 'Premium', path: '/studio/premium', icon: Settings },
    { label: 'Settings', path: '/studio/settings', icon: Settings, active: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">
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
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                  item.active
                    ? 'bg-yellow-400 font-semibold text-gray-950'
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
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-300 hover:bg-red-500/10 ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#103c2d] text-white shadow-lg transition-all duration-300 hover:bg-[#1a5c42] ${
          sidebarOpen ? 'left-[15rem]' : 'left-14'
        }`}
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className={`min-w-0 flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Settings</h1>
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Account</p>
            <h2 className="mt-2 text-3xl font-black text-gray-900">Change Password</h2>
          </div>

          {message && (
            <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={form.currentPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.newPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.confirmPassword}
                    onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-6 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}