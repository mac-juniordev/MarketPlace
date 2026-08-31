// Import React hooks
import { useState } from 'react';
// Import router
import { Link, useNavigate } from 'react-router-dom';
// Import motion
// import { motion } from 'framer-motion';

// Navbar component - sticky top navigation
// Customer side only. No auth. No register.
export default function Navbar() {
  // State for search input
  const [searchQuery, setSearchQuery] = useState('');
  // Navigation hook
  const navigate = useNavigate();

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Marketplace" className="w-10 h-10" />
            <span className="font-bold text-lg text-gray-900">Marketplace</span>
          </Link>

          {/* Search bar - center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services, property..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </form>

          {/* Right side - empty for customer */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              Cameroon
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}