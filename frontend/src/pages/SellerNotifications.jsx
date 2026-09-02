// Import React hooks
import { useEffect, useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
  Bell,
  Check,
  AlertTriangle,
} from 'lucide-react';

dayjs.extend(relativeTime);

// Seller notifications page
export default function SellerNotifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [notifications, setNotifications] = useState([]);

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

  const navItems = [
    { label: 'Dashboard', path: '/studio/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/studio/listings', icon: Package },
    { label: 'Reservations', path: '/studio/reservations', icon: ShoppingCart },
    { label: 'Reviews', path: '/studio/reviews', icon: Star },
    { label: 'Premium', path: '/studio/premium', icon: Settings },
    { label: 'Notifications', path: '/studio/notifications', icon: Bell, active: true },
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
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Notifications</h1>
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Updates</p>
            <h2 className="mt-2 text-3xl font-black text-gray-900">Your Notifications</h2>
          </div>

          {notifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <Bell size={28} className="mx-auto text-gray-400" />
              <h3 className="mt-5 font-bold text-gray-800">No notifications</h3>
              <p className="mt-1 text-sm text-gray-400">
                You are all caught up.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    {notification.type === 'warning' ? (
                      <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                    ) : (
                      <Check size={20} className="text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {dayjs(notification.time).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}