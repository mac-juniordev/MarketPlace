// Import React hooks
import { useState } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import icons
import { Store, Package, TrendingUp, ShieldCheck, MessageCircle, Check } from 'lucide-react';

// Admin WhatsApp number
const ADMIN_WHATSAPP = '237683764924';

// Become a seller page
export default function BecomeASeller() {
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    businessName: '',
    businessDescription: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = encodeURIComponent(
      `New Seller Application\n\n` +
      `Name: ${form.fullName}\n` +
      `Phone: ${form.phoneNumber}\n` +
      `Business: ${form.businessName}\n` +
      `Description: ${form.businessDescription}`
    );

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({
        fullName: '',
        phoneNumber: '',
        businessName: '',
        businessDescription: '',
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-gray-900">
      {/* HERO */}
      <section className="bg-[#103c2d] py-20 text-center">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Bring Your Business Online
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Join Marketplace and get your own online store. No code. No stress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-5xl mx-auto px-5 -mt-10">
        <div className="grid gap-5 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <Store size={24} className="text-emerald-700" />
            <h3 className="mt-3 font-bold text-gray-900">Your Own Store</h3>
            <p className="mt-1 text-sm text-gray-500">A dedicated page for your business and all your products.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <Package size={24} className="text-emerald-700" />
            <h3 className="mt-3 font-bold text-gray-900">Unlimited Listings</h3>
            <p className="mt-1 text-sm text-gray-500">Add products, services, property and vehicles.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <TrendingUp size={24} className="text-emerald-700" />
            <h3 className="mt-3 font-bold text-gray-900">Reach More Buyers</h3>
            <p className="mt-1 text-sm text-gray-500">Your listings are visible to everyone browsing Marketplace.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <ShieldCheck size={24} className="text-emerald-700" />
            <h3 className="mt-3 font-bold text-gray-900">Trust Signals</h3>
            <p className="mt-1 text-sm text-gray-500">Build credibility with verification and reviews.</p>
          </motion.div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="max-w-2xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-black text-gray-900">Apply to Join</h2>
          <p className="mt-2 text-gray-500">
            Fill this form. It will open WhatsApp with your application. Send it to us.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
          >
            <Check size={48} className="mx-auto text-green-600" />
            <h3 className="mt-4 text-xl font-black text-gray-900">Application Ready!</h3>
            <p className="mt-2 text-gray-600">
              We opened WhatsApp with your application. Send the message and we will contact you.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Example: John Doe"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Your Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="Example: +237 6XX XXX XXX"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  placeholder="Example: Douala Fashion"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-700">
                  What Do You Sell? <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={form.businessDescription}
                  onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
                  rows={4}
                  placeholder="Example: I sell shoes, bags and fashion accessories..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white font-bold text-sm transition hover:bg-green-600"
              >
                <MessageCircle size={18} />
                Apply via WhatsApp
              </button>

              <p className="text-center text-xs text-gray-400">
                No account needed. We review applications and contact you.
              </p>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}