// Import React hooks
import { useEffect, useState } from 'react';
// Import router
import { useParams } from 'react-router-dom';
// Import motion
// import { motion } from 'framer-motion';
// Import API
import { listingApi } from '../services/api';
// Import components
import ListingCard from '../components/ListingCard';
import LoadingScreen from '../components/LoadingScreen';
// Import icons
import { MapPin, Phone, Mail, Store, ShieldCheck } from 'lucide-react';

// Seller catalogue page
export default function SellerCatalogue() {
  const { businessId } = useParams();

  const [catalogue, setCatalogue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        const response = await listingApi.getBusinessCatalogue(businessId);
        setCatalogue(response.data);
      } catch (error) {
        console.error('Failed to fetch catalogue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogue();
  }, [businessId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!catalogue) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Business not found.</p>
      </div>
    );
  }

  const { business, listings } = catalogue;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      {/* Business header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Logo / initial */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-800 overflow-hidden">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="h-full w-full object-cover" />
              ) : (
                business.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            {/* Business info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">{business.name}</h1>
                {business.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                )}
              </div>

              {business.description && (
                <p className="mt-2 text-gray-600 leading-6">{business.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-4">
                {business.city && (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    {business.city}, {business.country || 'Cameroon'}
                  </span>
                )}
                {business.phoneNumber && (
                  <a href={`tel:${business.phoneNumber}`} className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800">
                    <Phone size={14} />
                    {business.phoneNumber}
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800">
                    <Mail size={14} />
                    {business.email}
                  </a>
                )}
              </div>
            </div>

            {/* WhatsApp button */}
            {business.phoneNumber && (
              <a
                href={`https://wa.me/${business.phoneNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors shrink-0"
              >
                <Store size={16} />
                Contact Seller
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">
            {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            All available items from {business.name}
          </p>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <Store size={28} className="mx-auto text-gray-400" />
            <h3 className="mt-5 font-bold text-gray-800">No listings yet</h3>
            <p className="mt-1 text-sm text-gray-400">
              This seller has not added any listings yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}