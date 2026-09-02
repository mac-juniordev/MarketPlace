// Import React hooks
import { useEffect, useState } from 'react';

// Import motion
import { motion } from 'framer-motion';

// Import router
import { useNavigate } from 'react-router-dom';

// Import dayjs
import dayjs from 'dayjs';

// Import API
import { reportApi } from '../services/api';

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
  Flag,
  Send,
} from 'lucide-react';

// Seller reports page
export default function SellerReports() {
  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [currentTime, setCurrentTime] = useState(dayjs());

  const [form, setForm] = useState({
    subject: '',
    message: '',
    reportType: 'issue',
  });

  const [submitting, setSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  // ============================================================
  // AUTHENTICATION CHECK
  // ============================================================

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/studio', { replace: true });
    }
  }, [navigate]);

  // ============================================================
  // LIVE CLOCK
  // ============================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/studio', {
      replace: true,
    });
  };

  // ============================================================
  // HANDLE FORM INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT REPORT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Combine the seller's selected type,
      // subject and message into the reason field
      // expected by CreateReportRequest.
      const reason = [
        `Report Type: ${form.reportType}`,
        `Subject: ${form.subject}`,
        '',
        form.message,
      ].join('\n');

      // Send report to:
      // POST /api/reports/seller
      await reportApi.createSellerReport({
        reason,

        // These fields are included because
        // CreateReportRequest expects them.
        reporterName: 'Seller',
        reporterPhone: '',
        reporterEmail: '',
      });

      // Show success message
      setSuccessMessage(
        'Report submitted successfully. The admin team will review it.'
      );

      // Reset form
      setForm({
        subject: '',
        message: '',
        reportType: 'issue',
      });

      // Automatically hide success message
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Failed to submit report:', error);

      // Try to get useful backend error message
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        'Failed to submit report. Please try again.';

      setErrorMessage(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // NAVIGATION ITEMS
  // ============================================================

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
      icon: Flag,
      active: true,
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex min-h-screen bg-[#f8f7f3]">
      {/* ======================================================
          SIDEBAR
      ======================================================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#103c2d] shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
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

        {/* Navigation */}
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

                {sidebarOpen && (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="shrink-0 border-t border-white/10 p-4">
          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate('/studio/profile')}
            title={!sidebarOpen ? 'Profile Settings' : undefined}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-white/75 transition-colors hover:bg-white/10 hover:text-white ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <Settings size={20} />

            {sidebarOpen && (
              <span>Profile Settings</span>
            )}
          </button>

          {/* Logout */}
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

      {/* ======================================================
          SIDEBAR TOGGLE
      ======================================================= */}

      <button
        type="button"
        onClick={() =>
          setSidebarOpen((prev) => !prev)
        }
        aria-label={
          sidebarOpen
            ? 'Collapse sidebar'
            : 'Expand sidebar'
        }
        className={`fixed top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#103c2d] text-white shadow-lg transition-all duration-300 hover:bg-[#1a5c42] ${
          sidebarOpen ? 'left-[15rem]' : 'left-14'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* ======================================================
          MAIN AREA
      ======================================================= */}

      <div
        className={`min-w-0 flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* ====================================================
            TOP HEADER
        ===================================================== */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                Report Issue
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {currentTime.format(
                  'dddd, DD MMMM YYYY'
                )}
              </p>
            </div>

            {/* Clock */}
            <div className="hidden items-center gap-4 rounded-xl bg-[#103c2d] px-5 py-3 sm:flex">
              <Clock
                size={22}
                className="text-yellow-400"
              />

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

        {/* ====================================================
            CONTENT
        ===================================================== */}

        <main className="p-5 sm:p-8">
          {/* Page heading */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
              Help
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
              Report an Issue
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Having a problem with Marketplace?
              Let the admin team know.
            </p>
          </div>

          {/* ==================================================
              SUCCESS MESSAGE
          =================================================== */}

          {successMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700"
            >
              {successMessage}
            </motion.div>
          )}

          {/* ==================================================
              ERROR MESSAGE
          =================================================== */}

          {errorMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* ==================================================
              FORM
          =================================================== */}

          <form
            onSubmit={handleSubmit}
            className="max-w-3xl"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-5">

                {/* Report Type */}
                <div>
                  <label
                    htmlFor="reportType"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    Report Type
                  </label>

                  <select
                    id="reportType"
                    name="reportType"
                    value={form.reportType}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="issue">
                      Technical Issue
                    </option>

                    <option value="complaint">
                      Complaint
                    </option>

                    <option value="compliment">
                      Compliment
                    </option>

                    <option value="suggestion">
                      Suggestion
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    Subject{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    maxLength={200}
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your report"
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-bold text-gray-700"
                  >
                    Message{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={5000}
                    value={form.message}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Describe the issue in detail..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {form.message.length}/5000
                  </p>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#103c2d] px-6 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={18} />

                    {submitting
                      ? 'Submitting...'
                      : 'Submit Report'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
