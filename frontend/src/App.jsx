// Import router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import auth provider
import { AuthProvider } from './context/AuthContext';
// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Import pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ListingDetail from './pages/ListingDetail';

// Main App component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
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
      </AuthProvider>
    </BrowserRouter>
  );
}