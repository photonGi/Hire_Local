import React, { useState } from 'react';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/useTheme';

interface NavbarProps {
  showCreateAccount?: boolean;
  currentPage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showCreateAccount = true, 
  currentPage = 'home'
}) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Home', path: '/', key: 'home' },
    { name: 'How it Works', path: '/how-it-works', key: 'how-it-works' },
    { name: 'Contact', path: '/contact', key: 'contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className={`
          backdrop-blur-xl rounded-2xl shadow-xl transition-all duration-300 relative overflow-hidden
          ${isDark 
            ? 'bg-gradient-to-r from-gray-900/85 via-gray-800/90 to-gray-900/85 border border-gray-700/50 shadow-2xl shadow-black/20' 
            : 'bg-gradient-to-r from-white/90 via-gray-50/95 to-white/90 border border-gray-200/60 shadow-2xl shadow-gray-900/10'
          }
        `}>
          {/* Modern gradient overlay */}
          <div className={`
            absolute inset-0 opacity-50 pointer-events-none
            ${isDark 
              ? 'bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5' 
              : 'bg-gradient-to-r from-blue-500/3 via-indigo-500/3 to-purple-500/3'
            }
          `} />
          
          {/* Subtle animated background pattern */}
          <div className={`
            absolute inset-0 opacity-20 pointer-events-none
            ${isDark 
              ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]' 
              : 'bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]'
            }
          `} />
          {/* Desktop Layout */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 relative z-10">
            {/* Logo */}
            <button 
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden
                ${isDark 
                  ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 shadow-blue-500/30' 
                  : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-blue-500/30'
                }
              `}>
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
              </div>
              <span className={`
                text-lg sm:text-xl font-bold transition-all duration-300 group-hover:scale-105 bg-gradient-to-r bg-clip-text
                ${isDark 
                  ? 'from-white via-blue-100 to-purple-200 text-transparent group-hover:from-blue-300 group-hover:to-purple-300' 
                  : 'from-gray-900 via-blue-900 to-indigo-900 text-transparent group-hover:from-blue-700 group-hover:to-indigo-700'
                }
              `}>
                HireLocalGPT
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className={`
              hidden lg:flex items-center space-x-2 backdrop-blur-sm rounded-full p-2 border transition-all duration-300
              ${isDark 
                ? 'bg-gray-800/30 border-gray-600/30 shadow-lg shadow-gray-900/20' 
                : 'bg-white/30 border-gray-300/30 shadow-lg shadow-gray-500/10'
              }
            `}>
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group mx-1
                    ${currentPage === item.key
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white shadow-lg shadow-blue-500/25 scale-[1.02] z-10'
                        : 'bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white shadow-lg shadow-blue-500/25 scale-[1.02] z-10'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/60 hover:to-gray-600/60 hover:z-10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-200/80 hover:z-10'
                    }
                  `}
                >
                  {/* Contained hover glow effect */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                    ${isDark 
                      ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 shadow-lg shadow-blue-500/10' 
                      : 'bg-gradient-to-r from-blue-500/3 to-indigo-500/3 shadow-lg shadow-blue-500/5'
                    }
                  `} />
                  <span className="relative z-10">{item.name}</span>
                </button>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className={`
                  p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 relative overflow-hidden group
                  ${isDark 
                    ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 hover:from-gray-700/70 hover:to-gray-600/70 text-gray-300 hover:text-white border border-gray-600/30' 
                    : 'bg-gradient-to-r from-gray-100/60 to-gray-200/60 hover:from-gray-200/70 hover:to-gray-300/70 text-gray-600 hover:text-gray-900 border border-gray-300/30'
                  }
                `}
                aria-label="Toggle theme"
              >
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isDark 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' 
                    : 'bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
                  }
                `} />
                {isDark ? <Sun className="w-4 h-4 relative z-10" /> : <Moon className="w-4 h-4 relative z-10" />}
              </button>
              
              <button 
                onClick={() => {
                  navigate('/auth');
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden group
                  ${isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 border border-gray-600/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100/70 hover:to-gray-200/70 border border-gray-300/20'
                  }
                `}
              >
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isDark 
                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' 
                    : 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5'
                  }
                `} />
                <span className="relative z-10">Sign In</span>
              </button>

              {showCreateAccount ? (
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group
                    ${isDark 
                      ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 hover:from-blue-600 hover:via-purple-700 hover:to-cyan-600 text-white shadow-blue-500/25 border border-blue-400/20' 
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-blue-500/25 border border-blue-400/20'
                    }
                  `}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">Get Started</span>
                </button>
              ) : (
                // Placeholder to maintain layout consistency when Get Started button is hidden
                <div className="px-6 py-2 font-semibold opacity-0 pointer-events-none" aria-hidden="true">
                  Get Started
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className={`
                lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 relative overflow-hidden group
                ${isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50 border border-gray-600/20' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100/70 hover:to-gray-200/70 border border-gray-300/20'
                }
              `}
            >
              <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isDark 
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
                  : 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5'
                }
              `} />
              {isMobileMenuOpen ? <X className="w-5 h-5 relative z-10" /> : <Menu className="w-5 h-5 relative z-10" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`
              lg:hidden border-t px-4 sm:px-6 py-4 space-y-2
              ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
            `}>
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105
                    ${currentPage === item.key
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400 shadow-lg'
                        : 'bg-blue-500/10 text-blue-600 shadow-lg'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}
              
              <div className={`
                pt-4 mt-4 border-t space-y-2
                ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
              `}>
                <button 
                  onClick={toggleTheme}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105
                    ${isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }
                  `}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105
                    ${isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                    }
                  `}
                >
                  Sign In
                </button>

                {showCreateAccount && (
                  <button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-center
                      ${isDark 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                      }
                    `}
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;