// Import React hooks
import { useEffect, useMemo, useState } from 'react';
// Import motion
import { motion, AnimatePresence } from 'framer-motion';
// Import router
import { useNavigate } from 'react-router-dom';
// Import dayjs
import dayjs from 'dayjs';
// Import API
import { categoryApi } from '../services/api';
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
  Pencil,
  Trash2,
  Tag,
} from 'lucide-react';

// Admin categories page
export default function AdminCategories() {
  // Navigation hook
  const navigate = useNavigate();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/control', { replace: true });
    }
  }, [navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) => {
      const searchableText = [
        category.name,
        category.slug,
        category.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [categories, searchQuery]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Handle name change
  const handleNameChange = (value) => {
    setNewCategory((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  // Create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // This will call the API when backend endpoint is ready
      // For now, just close the modal
      setShowCreateModal(false);
      setNewCategory({ name: '', slug: '', description: '' });
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  // Edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      setShowEditModal(false);
      setEditingCategory(null);
      setNewCategory({ name: '', slug: '', description: '' });
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  // Close modals
  const closeCreateModal = () => {
    if (saving) return;
    setShowCreateModal(false);
    setNewCategory({ name: '', slug: '', description: '' });
  };

  const closeEditModal = () => {
    if (saving) return;
    setShowEditModal(false);
    setEditingCategory(null);
    setNewCategory({ name: '', slug: '', description: '' });
  };

  // Navigation
  const navItems = [
    { label: 'Dashboard', path: '/control/dashboard', icon: LayoutDashboard },
    { label: 'Sellers', path: '/control/sellers', icon: Users },
    { label: 'Categories', path: '/control/categories', icon: FolderOpen, active: true },
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
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">Categories</h1>
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
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Category Management</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Create and manage the categories used to organize marketplace listings.
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
                placeholder="Search categories..."
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
              Create Category
            </button>
          </div>

          {/* CATEGORIES GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
                  <FolderOpen size={28} className="text-gray-400" />
                </div>
                <h3 className="mt-5 font-bold text-gray-800">No categories found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {searchQuery ? 'Try a different search term.' : 'Create your first category to get started.'}
                </p>
              </div>
            ) : (
              filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                        <Tag size={20} className="text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-400">{category.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        title="Edit category"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        title="Delete category"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {category.description && (
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              type="button"
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
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="text-xl font-black text-gray-950">Create Category</h2>
                  <p className="mt-1 text-sm text-gray-500">Add a new category for listings.</p>
                </div>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Example: Electronics"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    readOnly
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Briefly describe this category..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-[#103c2d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:opacity-60"
                  >
                    {saving ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="absolute inset-0 cursor-default bg-gray-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="text-xl font-black text-gray-950">Edit Category</h2>
                  <p className="mt-1 text-sm text-gray-500">Update category details.</p>
                </div>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    readOnly
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-[#103c2d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#174d3a] disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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