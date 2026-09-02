import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ListingDetail from './pages/ListingDetail';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSellers from './pages/AdminSellers';
import AdminCategories from './pages/AdminCategories';
import AdminReports from './pages/AdminReports';
import AdminAuditLogs from './pages/AdminAuditLogs';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =================================================
              CUSTOMER ROUTES
          ================================================= */}
          <Route path="/" element={<CustomerLayout />} />

          {/* =================================================
              ADMIN ROUTES
          ================================================= */}
          <Route
            path="/control"
            element={<AdminLogin />}
          />

          <Route
            path="/control/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/control/sellers"
            element={<AdminSellers />}
          />

          <Route
            path="/control/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/control/reports"
            element={<AdminReports />}
          />

          <Route
            path="/control/audit-logs"
            element={<AdminAuditLogs />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/search"
            element={<SearchResults />}
          />

          <Route
            path="/listing/:id"
            element={<ListingDetail />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}