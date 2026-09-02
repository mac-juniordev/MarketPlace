// Import React hooks
import { useEffect, useMemo, useState } from 'react';
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
  Users,
  FolderOpen,
  Flag,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  FileText,
} from 'lucide-react';

// Enable relative time
dayjs.extend(relativeTime);

// Admin audit logs page
export default function AdminAuditLogs() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/control', { replace: true });
    }
  }, [navigate]);

  // Fetch logs - will connect to API later
  useEffect(() => {
    setLogs([]);
    setLoading(false);
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
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return logs;

    return logs.filter((log) => {
      const searchableText = [log.action, log.targetEntity, log.reason]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [logs, searchQuery]);

  // Navigation
  const navItems = [
    { label: 'Dashboard', path: '/control/dashboard', icon: LayoutDashboard },
    { label: 'Sellers', path: '/control/sellers', icon: Users },
    { label: 'Categories', path: '/control/categories', icon: FolderOpen },
    { label: 'Reports', path: '/control/reports', icon: Flag },
    { label: 'Audit Logs', path: '/control/audit-logs', icon: ScrollText, active: true },
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Audit Logs</h1>
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
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Audit Logs</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track administrative actions and system events.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mb-5">
            <div className="relative w-full sm:max-w-md">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit logs..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* LOGS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Action</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Target</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Reason</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                            <FileText size={28} className="text-gray-400" />
                          </div>
                          <h3 className="mt-5 font-bold text-gray-800">No audit logs found</h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {searchQuery ? 'Try a different search term.' : 'Administrative actions will appear here.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                        className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{log.targetEntity}</td>
                        <td className="px-6 py-4 text-gray-600">{log.reason || '-'}</td>
                        <td className="px-6 py-4 text-gray-400">{dayjs(log.createdAt).fromNow()}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}