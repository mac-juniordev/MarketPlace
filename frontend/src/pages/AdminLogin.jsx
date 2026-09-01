// Import React hooks
import { useState } from 'react';
// Import router
import { useNavigate } from 'react-router-dom';
// Import motion
import { motion } from 'framer-motion';
// Import auth API
import { authApi } from '../services/api';

// Admin login page - secret route /control
export default function AdminLogin() {
  // Navigation hook
  const navigate = useNavigate();
  // State for form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for login progress
  const [loggingIn, setLoggingIn] = useState(false);
  // State for error
  const [error, setError] = useState('');

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response.data;

      // Save token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to admin dashboard
      navigate('/control/dashboard');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.img
            src="/favicon.svg"
            alt="Marketplace"
            className="w-16 h-16 mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="mt-4 text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-2">Restricted access</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-2xl p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Progress bar when logging in */}
          {loggingIn && (
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}