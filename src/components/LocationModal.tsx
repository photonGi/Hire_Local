import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  theme: 'light' | 'dark';
}

const LocationIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SearchIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, onLocationSelect, theme }) => {
  const [customLocation, setCustomLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularLocations = [
    'Lahore, Pakistan',
    'Karachi, Pakistan', 
    'Islamabad, Pakistan',
    'Rawalpindi, Pakistan',
    'Faisalabad, Pakistan',
    'Multan, Pakistan',
    'Peshawar, Pakistan',
    'Quetta, Pakistan'
  ];

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
      ? 'w-full bg-transparent px-4 py-3 pl-12 text-white placeholder-slate-400 focus:outline-none'
      : 'w-full bg-transparent px-4 py-3 pl-12 text-slate-800 placeholder-slate-500 focus:outline-none',
    searchIcon: theme === 'dark' ? 'absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400' : 'absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500',
    submitButton: theme === 'dark'
      ? 'w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      : 'w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
    divider: theme === 'dark' ? 'flex items-center my-6 text-slate-500' : 'flex items-center my-6 text-slate-400',
    dividerLine: theme === 'dark' ? 'flex-1 h-px bg-slate-700' : 'flex-1 h-px bg-slate-300',
    popularTitle: theme === 'dark' ? 'text-sm font-semibold text-slate-300 mb-3' : 'text-sm font-semibold text-slate-600 mb-3',
    locationButton: theme === 'dark'
      ? 'w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/60 text-slate-200 hover:text-white transition-all duration-200 flex items-center gap-3'
      : 'w-full text-left p-3 rounded-xl bg-slate-100/60 hover:bg-slate-200/60 border border-slate-300/50 hover:border-slate-400/60 text-slate-700 hover:text-slate-800 transition-all duration-200 flex items-center gap-3',
    closeButton: theme === 'dark'
      ? 'mt-4 w-full py-3 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600/60 rounded-2xl transition-all duration-200'
      : 'mt-4 w-full py-3 border border-slate-300/60 text-slate-600 hover:text-slate-800 hover:border-slate-400/60 rounded-2xl transition-all duration-200'
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
                To provide better service recommendations, please select your location
              </p>
            </div>

            <form onSubmit={handleCustomLocationSubmit}>
              <div className={themeClasses.inputContainer}>
                <SearchIcon />
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

            <div className={themeClasses.divider}>
              <div className={themeClasses.dividerLine}></div>
              <span className="px-3 text-sm">or choose from popular locations</span>
              <div className={themeClasses.dividerLine}></div>
            </div>

            <div>
              <h3 className={themeClasses.popularTitle}>Popular Locations</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {popularLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    disabled={isLoading}
                    className={themeClasses.locationButton}
                  >
                    <LocationIcon />
                    <span>{location}</span>
                  </button>
                ))}
              </div>
            </div>

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
