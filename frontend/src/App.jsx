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

import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import SellerProfile from './pages/SellerProfile';
import SellerListings from './pages/SellerListings';
import SellerCreateListing from './pages/SellerCreateListing';
import SellerEditListing from './pages/SellerEditListing';
import SellerReservations from './pages/SellerReservations';
import SellerPremium from './pages/SellerPremium';
import SellerReports from './pages/SellerReports';
import SellerReviews from './pages/SellerReviews';
import SellerAnalytics from './pages/SellerAnalytics';
import SellerNotifications from './pages/SellerNotifications';
import SellerSettings from './pages/SellerSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CustomerLayout />} />

          <Route path="/control" element={<AdminLogin />} />
          <Route path="/control/dashboard" element={<AdminDashboard />} />
          <Route path="/control/sellers" element={<AdminSellers />} />
          <Route path="/control/categories" element={<AdminCategories />} />
          <Route path="/control/reports" element={<AdminReports />} />
          <Route path="/control/audit-logs" element={<AdminAuditLogs />} />

          <Route path="/studio" element={<SellerLogin />} />
          <Route path="/studio/dashboard" element={<SellerDashboard />} />
          <Route path="/studio/profile" element={<SellerProfile />} />
          <Route path="/studio/listings" element={<SellerListings />} />
          <Route path="/studio/listings/create" element={<SellerCreateListing />} />
          <Route path="/studio/listings/edit/:id" element={<SellerEditListing />} />
          <Route path="/studio/reservations" element={<SellerReservations />} />
          <Route path="/studio/premium" element={<SellerPremium />} />
          <Route path="/studio/reports" element={<SellerReports />} />
          <Route path="/studio/reviews" element={<SellerReviews />} />
          <Route path="/studio/analytics" element={<SellerAnalytics />} />
          <Route path="/studio/notifications" element={<SellerNotifications />} />
          <Route path="/studio/settings" element={<SellerSettings />} />
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
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}