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
  Check,
  TrendingUp,
  BarChart3,
  Megaphone,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// Seller premium page
export default function SellerPremium() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

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
    { label: 'Reviews', path: '/studio/reviews', icon: Star },
    { label: 'Premium', path: '/studio/premium', icon: TrendingUp, active: true },
    { label: 'Report Issue', path: '/studio/reports', icon: Settings },
  ];

  // Plans data
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'For sellers getting started',
      features: [
        'Up to 10 active listings',
        'Basic listing management',
        'Standard visibility',
        'Email support',
      ],
      cta: 'Current Plan',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '5,000',
      description: 'For growing businesses',
      features: [
        'Up to 50 active listings',
        'Advanced analytics dashboard',
        'Priority search ranking',
        'Featured listing placement',
        'WhatsApp support',
      ],
      cta: 'Upgrade to Premium',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '15,000',
      description: 'For established businesses',
      features: [
        'Unlimited active listings',
        'Full analytics suite',
        'Top search ranking',
        'All featured placements',
        'Dedicated account manager',
        'API access',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Premium</h1>
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

        {/* CONTENT */}
        <main className="p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Upgrade</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Premium Plans</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Optional tools to help your business grow. You can stay on the free plan forever.
            </p>
          </div>

          {/* PLANS GRID */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  plan.highlighted
                    ? 'border-yellow-300 ring-2 ring-yellow-200'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 mb-4">
                    <Zap size={13} />
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-black text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

                <p className="mt-4">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500"> XAF/month</span>
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    if (plan.name === 'Business') {
                      alert('Contact us for Business plan pricing.');
                    } else if (plan.name === 'Premium') {
                      alert('Premium checkout coming soon.');
                    }
                  }}
                  className={`mt-8 w-full h-12 rounded-xl font-bold text-sm transition ${
                    plan.highlighted
                      ? 'bg-[#103c2d] text-white hover:bg-[#174d3a]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* WHY UPGRADE */}
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <BarChart3 size={24} className="text-emerald-700" />
              <h4 className="mt-3 font-bold text-gray-900">Advanced Analytics</h4>
              <p className="mt-1 text-sm text-gray-500">Know what sells and when.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <Megaphone size={24} className="text-blue-600" />
              <h4 className="mt-3 font-bold text-gray-900">Promoted Listings</h4>
              <p className="mt-1 text-sm text-gray-500">Reach more buyers.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <ShieldCheck size={24} className="text-purple-600" />
              <h4 className="mt-3 font-bold text-gray-900">Priority Support</h4>
              <p className="mt-1 text-sm text-gray-500">Get help when you need it.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <TrendingUp size={24} className="text-yellow-600" />
              <h4 className="mt-3 font-bold text-gray-900">Grow Faster</h4>
              <p className="mt-1 text-sm text-gray-500">Tools built for growth.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}