import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  theme: 'light' | 'dark';
}

const SearchIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationSelect, theme }) => {
  const [customLocation, setCustomLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (location: string) => {
    setIsLoading(true);
    try {
      onLocationSelect(location);
      onClose();
    } catch (error) {
      console.error('Error selecting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      handleLocationSelect(customLocation.trim());
    }
  };

  const themeClasses = {
    backdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4',
    modal: theme === 'dark' 
      ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-black/40'
      : 'bg-white/95 backdrop-blur-xl border border-slate-300/60 rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-gray-400/40',
    title: theme === 'dark' ? 'text-xl font-bold text-white mb-2' : 'text-xl font-bold text-slate-800 mb-2',
    subtitle: theme === 'dark' ? 'text-slate-400 text-sm mb-6' : 'text-slate-600 text-sm mb-6',
    inputContainer: theme === 'dark'
      ? 'relative mb-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl focus-within:ring-2 focus-within:ring-teal-500/60 focus-within:border-teal-500/60 transition-all'
      : 'relative mb-4 bg-slate-50/80 border border-slate-300/60 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/60 focus-within:border-blue-500/60 transition-all',
    input: theme === 'dark' 
      ? 'w-full bg-transparent px-4 py-3 pl-12 text-white placeholder-slate-400 focus:outline-none rounded-2xl'
      : 'w-full bg-transparent px-4 py-3 pl-12 text-slate-800 placeholder-slate-500 focus:outline-none rounded-2xl',
    searchIcon: theme === 'dark' ? 'absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none' : 'absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none',
    submitButton: theme === 'dark'
      ? 'w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
      : 'w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg',
    closeButton: theme === 'dark'
      ? 'mt-6 w-full py-3 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600/60 rounded-2xl transition-all duration-200 font-medium'
      : 'mt-6 w-full py-3 border border-slate-300/60 text-slate-600 hover:text-slate-800 hover:border-slate-400/60 rounded-2xl transition-all duration-200 font-medium'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={themeClasses.backdrop}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={themeClasses.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className={themeClasses.title}>Select Your Location</h2>
              <p className={themeClasses.subtitle}>
                Help us find services near you
              </p>
            </div>

            <form onSubmit={handleCustomLocationSubmit}>
              <div className={themeClasses.inputContainer}>
                <div className={themeClasses.searchIcon}>
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Enter your city or area..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className={themeClasses.input}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!customLocation.trim() || isLoading}
                className={themeClasses.submitButton}
              >
                {isLoading ? 'Setting Location...' : 'Use This Location'}
              </button>
            </form>

            <button
              onClick={onClose}
              className={themeClasses.closeButton}
              disabled={isLoading}
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
