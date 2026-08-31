// Import motion
import { motion } from 'framer-motion';

// Loading screen with animated logo and loader
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Animated logo */}
      <motion.img
        src="/logo.svg"
        alt="Marketplace"
        className="w-20 h-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Loading text */}
      <motion.p
        className="mt-4 text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Marketplace
      </motion.p>

      {/* Animated loader bar */}
      <div className="mt-6 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-600 rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}