// Import React hooks
import { useState } from 'react';
// Import router
import { Link, useNavigate } from 'react-router-dom';
// Import motion
// import { motion } from 'framer-motion';

// Navbar component
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
            <img src="/favicon.svg" alt="Marketplace" className="w-10 h-10" />
            <span className="font-bold text-lg text-gray-900">Marketplace</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, services, property..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </form>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              to="/become-a-seller"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Become a Seller
            </Link>
            <span className="text-xs text-gray-400 hidden sm:block">
              Cameroon
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}