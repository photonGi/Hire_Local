import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useAuth } from "../../contexts/AuthContextHooks";
import { BusinessService } from "../../services/BusinessService";
import { UserActivityService } from "../../services/UserActivityService";
import { locationService } from "../../services/LocationService";
import { LocationModal } from "../LocationModal";
import type { Business } from "../../types/firebase";
import type { UserLocation } from "../../types/firebase";

/* ------------------- Types ------------------- */
type Sender = "user" | "ai";

interface Provider {
  name: string;
  phone?: string;
  address?: string;
  details?: string;
  location_note?: string;
  confidence?: string;
  saved?: boolean;
  saveId?: string;
}

interface Message {
  id: number;
  sender: Sender;
  text: string;
  fullText?: string;
  providers?: Provider[] | null;
  suggestions?: string[] | null;
  suggestionsVisible?: boolean;
}

type AiStage = "idle" | "thinking" | "searching" | "organizing";

/* ------------------- Hooks ------------------- */
const useAutoScroll = (ref: React.RefObject<HTMLElement>, dependency: unknown) => {
  useLayoutEffect(() => {
    const scrollContainer = ref.current;
    if (!scrollContainer) return;

    let isUserScrolling = false;
    let scrollTimeout: number | undefined;

    const scrollToBottom = () => {
      if (!isUserScrolling) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
      }
    };

    const handleScroll = () => {
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      isUserScrolling = !atBottom;
      scrollTimeout = window.setTimeout(() => {
        if (!isUserScrolling) scrollToBottom();
      }, 1000);
    };

    if (typeof dependency === "number") {
      if (dependency > 0) scrollToBottom();
    } else {
      scrollToBottom();
    }

    const observer = new MutationObserver(scrollToBottom);
    observer.observe(scrollContainer, { childList: true, subtree: true });
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
    };
  }, [ref, dependency]);
};

/* ------------------- Icons & Small UI Helpers ------------------- */
const SendIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const BackIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const BookmarkIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const LocationIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EditLocationIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ServiceIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-teal-300 shadow-inner">
    {children}
  </div>
);

const PlumberIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M20.5 14c.28 0 .5.22.5.5v2.5c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2v-2.5c0-.28.22-.5.5-.5s.5.22.5.5V17c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-2.5c0-.28.22-.5.5-.5zM4 14h6v2H4zM4 11h9v2H4zM4 8h12v2H4zM4 5h14v2H4z" />
      <path d="M16.5 14H15v-1.5c0-1.1-.9-2-2-2h-1c-1.1 0-2 .9-2 2V14h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1.5V12c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v1.5h1.5c.28 0 .5.22.5.5s-.22.5-.5.5z" />
    </svg>
  </ServiceIconWrapper>
);

const ElectricianIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M13 2L3 14h9l-1 8 11-12h-9z" />
    </svg>
  </ServiceIconWrapper>
);

const HandymanIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.6-3.6a1 1 0 00-1.4-1.4l-1.6 1.6-1.6-1.6a1 1 0 00-1.4 0zM12.7 21.7a1 1 0 001.4 0l6-6a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-6 6a1 1 0 000 1.4z" />
      <path d="M2.3 13.3a1 1 0 000 1.4l6 6a1 1 0 001.4 0l1.6-1.6a1 1 0 000-1.4l-6-6a1 1 0 00-1.4 0l-1.6 1.6z" />
    </svg>
  </ServiceIconWrapper>
);

const CleanerIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </ServiceIconWrapper>
);

const MechanicIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M18.36 6.64a9 9 0 11-12.73 0" />
      <path d="M12 2v10" />
    </svg>
  </ServiceIconWrapper>
);

const BarberIcon: React.FC = () => (
  <ServiceIconWrapper>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88" />
      <path d="M14.47 14.48L20 20" />
      <path d="M8.12 8.12L12 12" />
    </svg>
  </ServiceIconWrapper>
);

const LiveOrbIcon: React.FC<{ isTyping?: boolean }> = ({ isTyping }) => (
  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg transition-all duration-300 ${isTyping ? "animate-pulse" : ""}`}>
    <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 animate-orb-glow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animate-orb-spin">
        <div className="w-1/2 h-full bg-white/20 rounded-full blur-2xl" />
      </div>
    </div>
  </div>
);

const UserGlowingOrbIcon: React.FC = () => (
  <div className="w-9 h-9 rounded-full flex-shrink-0 hidden sm:flex items-center justify-center shadow-md bg-white glowing-orb" />
);

/* ------------------- LocationUpdateButton Component ------------------- */
const LocationUpdateButton: React.FC<{ 
  userLocation: UserLocation | null; 
  theme: "light" | "dark"; 
  onClick: () => void 
}> = ({ userLocation, theme, onClick }) => {
  const themeClasses = {
    button: theme === "dark"
      ? "flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 shadow-sm"
      : "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 hover:bg-white/90 border border-slate-300/60 text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm backdrop-blur-sm",
    text: theme === "dark" ? "text-xs font-medium max-w-32 truncate" : "text-xs font-medium max-w-32 truncate",
  };

  const locationDisplay = userLocation 
    ? locationService.formatLocationForDisplay(userLocation)
    : "Set Location";

  return (
    <button onClick={onClick} className={`${themeClasses.button} group`} title="Update Location">
      <LocationIcon />
      <span className={themeClasses.text}>{locationDisplay}</span>
      <EditLocationIcon />
    </button>
  );
};

/* ------------------- Enhanced Location Modal Component ------------------- */
const EnhancedLocationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onManualLocationSelect: (location: string) => void;
  onGPSLocationRequest: () => void;
  theme: "light" | "dark";
}> = ({ isOpen, onClose, onManualLocationSelect, onGPSLocationRequest, theme }) => {
  const [customLocation, setCustomLocation] = useState("");

  if (!isOpen) return null;

  const themeClasses = {
    backdrop: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
    modal: theme === "dark"
      ? "bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full"
      : "bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-300/50 shadow-2xl max-w-md w-full",
    title: theme === "dark" ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-slate-800 mb-2",
    subtitle: theme === "dark" ? "text-slate-400 text-sm mb-6" : "text-slate-600 text-sm mb-6",
    button: theme === "dark"
      ? "w-full p-4 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/50 text-white transition-all duration-200 flex items-center gap-3"
      : "w-full p-4 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-300/60 text-slate-800 transition-all duration-200 flex items-center gap-3",
    input: theme === "dark"
      ? "w-full p-3 rounded-lg bg-slate-700/60 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
      : "w-full p-3 rounded-lg bg-white/80 border border-slate-300/60 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
    submitButton: theme === "dark"
      ? "w-full mt-3 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium transition-colors"
      : "w-full mt-3 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors",
  };

  const handleGPSRequest = () => {
    onGPSLocationRequest();
    onClose();
  };

  const handleManualSubmit = () => {
    if (customLocation.trim()) {
      onManualLocationSelect(customLocation.trim());
      onClose();
      setCustomLocation("");
    }
  };

  return (
    <div className={themeClasses.backdrop} onClick={onClose}>
      <div className={themeClasses.modal} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className={themeClasses.title}>Update Location</h2>
          <p className={themeClasses.subtitle}>Choose how you'd like to set your location</p>
          
          <div className="space-y-4">
            <button onClick={handleGPSRequest} className={themeClasses.button}>
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <LocationIcon />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Use Current Location</p>
                <p className="text-xs opacity-70">Automatically detect via GPS</p>
              </div>
            </button>

            <div className="space-y-3">
              <p className="text-sm font-medium opacity-80">Or enter manually:</p>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g., Downtown Lahore, Pakistan"
                className={themeClasses.input}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <button
                onClick={handleManualSubmit}
                disabled={!customLocation.trim()}
                className={`${themeClasses.submitButton} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Set Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------- UI Components ------------------- */
const RevealedText: React.FC<{ text: string; onComplete: () => void; isTyping: boolean }> = ({ text, onComplete, isTyping }) => {
  const [display, setDisplay] = useState("");
  const typingRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (typingRef.current) {
      window.clearInterval(typingRef.current);
      typingRef.current = null;
    }

    if (!text) {
      setDisplay("");
      doneRef.current = true;
      return;
    }

    if (!isTyping) {
      setDisplay(text);
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
      return;
    }

    doneRef.current = false;
    setDisplay("");
    let i = 0;
    typingRef.current = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        if (typingRef.current) {
          window.clearInterval(typingRef.current);
          typingRef.current = null;
        }
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete();
        }
      }
    }, 20);

    return () => {
      if (typingRef.current) {
        window.clearInterval(typingRef.current);
        typingRef.current = null;
      }
    };
  }, [text, isTyping, onComplete]);

  return <span className="whitespace-pre-wrap">{display}</span>;
};

const GlobalStyles: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
    html, body { background: ${theme === "dark" ? "#000" : "transparent"}; overflow: hidden; }
    body::before {
      content: '';
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: ${theme === "dark" 
        ? "radial-gradient(circle at top left, rgba(20, 184, 166, 0.1) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(239, 68, 68, 0.1) 0%, transparent 40%)"
        : "radial-gradient(circle at top left, rgba(71, 85, 105, 0.1) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(100, 116, 139, 0.1) 0%, transparent 40%)"
      };
      z-index: -1; pointer-events: none;
    }
    @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes orb-glow { 0%,100% { box-shadow: 0 0 12px rgba(20,184,166,0.3), 0 0 4px rgba(20,184,166,0.2);} 50% { box-shadow: 0 0 24px rgba(20,184,166,0.6), 0 0 8px rgba(20,184,166,0.3);} }
    @keyframes orb-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
    @keyframes pulse-white-glow { from { box-shadow: 0 0 10px rgba(255,255,255,0.8),0 0 20px rgba(255,255,255,0.6),0 0 30px rgba(255,255,255,0.4);} to { box-shadow: 0 0 15px rgba(255,255,255,1),0 0 25px rgba(255,255,255,0.8),0 0 35px rgba(255,255,255,0.6); } }
    .glowing-orb { animation: pulse-white-glow 2s infinite alternate; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2,0.8,0.2,1) forwards; }
    .animate-orb-glow { animation: orb-glow 3s infinite ease-in-out; }
    .animate-orb-spin { animation: orb-spin 10s linear infinite; }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 3px; }
  `}</style>
);

const ProviderCard: React.FC<{ provider: Provider; theme: "light" | "dark" }> = ({ provider, theme }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(provider.saved || false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      // Could show a login prompt here
      return;
    }

    setSaving(true);
    try {
      if (saved) {
        // Unsave the business
        if (provider.saveId) {
          await BusinessService.unsaveBusiness(user.uid, provider.saveId);
          setSaved(false);
        }
      } else {
        // Save the business
        const businessData: Business = {
          id: provider.saveId || Date.now().toString(), // Temporary ID if not available
          name: provider.name,
          description: provider.details || '',
          category: 'service', // Default category
          services: [],
          location: {
            address: provider.address || '',
          },
          phone: provider.phone || '',
          address: provider.address || '',
          saved: true,
        };

        const saveId = await BusinessService.saveBusiness(user.uid, businessData);
        provider.saveId = saveId;
        setSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving business:', error);
      // Could show an error toast here
    } finally {
      setSaving(false);
    }
  };

  const themeClasses = {
    card: theme === "dark"
      ? "flex flex-col h-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-5 shadow-lg shadow-black/20"
      : "flex flex-col h-full bg-white/90 backdrop-blur-sm border border-slate-300/40 rounded-3xl p-5 shadow-lg shadow-gray-400/20",
    name: theme === "dark" ? "font-bold text-white text-lg" : "font-bold text-slate-800 text-lg",
    details: theme === "dark" ? "text-sm text-slate-400 mt-2" : "text-sm text-slate-600 mt-2",
    showMore: theme === "dark" ? "mt-2 text-teal-400 hover:text-teal-300 font-semibold text-xs transition-colors" : "mt-2 text-blue-500 hover:text-blue-400 font-semibold text-xs transition-colors",
    contact: theme === "dark" ? "flex items-center gap-3 text-slate-300 text-sm" : "flex items-center gap-3 text-slate-600 text-sm",
    divider: theme === "dark" ? "mt-4 pt-4 border-t border-slate-700/50 space-y-3" : "mt-4 pt-4 border-t border-slate-300/50 space-y-3",
    saveButton: theme === "dark" 
      ? saved 
        ? "w-8 h-8 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 hover:text-teal-200 transition-all duration-200 flex items-center justify-center shadow-sm"
        : "w-8 h-8 rounded-lg bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/50 text-slate-400 hover:text-slate-300 transition-all duration-200 flex items-center justify-center shadow-sm"
      : saved
        ? "w-8 h-8 rounded-lg bg-blue-100/80 hover:bg-blue-200/80 border border-blue-300/60 text-blue-600 hover:text-blue-700 transition-all duration-200 flex items-center justify-center shadow-sm"
        : "w-8 h-8 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 border border-gray-300/60 text-gray-500 hover:text-gray-600 transition-all duration-200 flex items-center justify-center shadow-sm",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
      }}
      className={themeClasses.card}
    >
      <div className="flex-grow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <h3 className={themeClasses.name}>{provider.name}</h3>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !user}
            className={themeClasses.saveButton}
            aria-label={saved ? "Remove from saved" : "Save business"}
            title={saved ? "Remove from saved" : "Save business"}
          >
            {saving ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <BookmarkIcon filled={saved} />
            )}
          </button>
        </div>
      </div>

      <div className={themeClasses.divider}>
        <div className={themeClasses.contact}><PhoneIcon /><span>{provider.phone}</span></div>
        <div className={themeClasses.contact}><LocationIcon /><span>{provider.address}</span></div>
      </div>
    </motion.div>
  );
};

/* ------------------- MessageBubble (fixed typing and structure) ------------------- */
interface MessageBubbleProps {
  m: Message;
  onSuggestionSelect: (text: string, messageId: number) => void;
  theme: "light" | "dark";
}

const MessageBubbleComponent: React.FC<MessageBubbleProps> = ({ m, onSuggestionSelect, theme }) => {
  const isUser = m.sender === "user";
  const [visibleProviders, setVisibleProviders] = useState(3);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (isUser || !m.fullText) {
      setIsTypingComplete(true);
    } else {
      setIsTypingComplete(false);
    }
  }, [m.id, m.fullText, isUser]);

  const handleRevealComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  const themeClasses = {
    messageBubble: theme === "dark"
      ? isUser
        ? "bg-white text-black rounded-br-lg"
        : "bg-slate-800/60 backdrop-blur-sm text-white rounded-bl-lg border border-slate-700/50"
      : isUser
        ? "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white rounded-br-lg"
        : "bg-white/90 backdrop-blur-sm text-slate-800 rounded-bl-lg border border-slate-300/40",
    suggestionButton: theme === "dark"
      ? "bg-slate-800/40 text-slate-300 text-sm font-medium py-2 px-4 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
      : "bg-slate-200/60 text-slate-700 text-sm font-medium py-2 px-4 rounded-full border border-slate-300/40 hover:bg-slate-300/70 transition-colors",
    showAllButton: theme === "dark"
      ? "bg-slate-700/80 text-teal-300 text-sm font-semibold py-2 px-6 rounded-full hover:bg-slate-700 transition-colors duration-200"
      : "bg-slate-600/80 text-blue-300 text-sm font-semibold py-2 px-6 rounded-full hover:bg-slate-700 transition-colors duration-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`flex gap-3 ${isUser ? "items-end flex-row-reverse" : "items-start"}`}
    >
      {isUser ? <UserGlowingOrbIcon /> : <LiveOrbIcon />}
      <div className={`${m.providers ? "w-full" : "max-w-[85%] sm:max-w-[70%]"} flex flex-col items-start gap-3`}>
        <div className={`px-5 py-3 rounded-2xl text-base leading-relaxed shadow-md ${themeClasses.messageBubble}`}>
          {m.sender === "ai" && m.fullText ? (
            <RevealedText text={m.fullText} onComplete={handleRevealComplete} isTyping={!isTypingComplete} />
          ) : (
            <span>{m.text}</span>
          )}
        </div>

        <AnimatePresence>
          {m.suggestions && m.suggestionsVisible && isTypingComplete && (
            <motion.div className="flex flex-wrap gap-2" exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}>
              {m.suggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onSuggestionSelect(suggestion, m.id)}
                  className={themeClasses.suggestionButton}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1, type: "spring", stiffness: 100 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {m.providers && isTypingComplete && (
            <motion.div
              key={`providers-${m.id}`}
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              }}
            >
              {m.providers.slice(0, visibleProviders).map((p, idx) => (
                <ProviderCard key={p.name ?? idx} provider={p} theme={theme} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {m.providers && m.providers.length > visibleProviders && (
          <div className="w-full flex justify-center">
            <button onClick={() => setVisibleProviders(m.providers!.length)} className={themeClasses.showAllButton}>
              Show all ({m.providers.length})
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MessageBubble = React.memo(MessageBubbleComponent) as typeof MessageBubbleComponent;

/* ------------------- AIThinkingBubble (no vertical jump) ------------------- */
const AIThinkingBubble: React.FC<{ stage: Exclude<AiStage, "idle">; willShowProviders: boolean; theme: "light" | "dark" }> = ({ stage, willShowProviders, theme }) => {
  const stageMessages: Record<Exclude<AiStage, "idle">, string> = {
    thinking: "Understanding...",
    searching: "Searching providers...",
    organizing: "Organizing results...",
  };

  const themeClasses = {
    bubble: theme === "dark"
      ? "bg-slate-800/40 backdrop-blur-sm rounded-2xl rounded-bl-lg px-4 py-3 shadow-md border border-slate-700/50"
      : "bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-lg px-4 py-3 shadow-md border border-slate-300/40",
    text: theme === "dark" ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-slate-600",
    skeleton: theme === "dark" ? "bg-slate-800/40 rounded-3xl p-5 shadow-lg h-36 skeleton-pulse" : "bg-white/80 rounded-3xl p-5 shadow-lg h-36 skeleton-pulse",
    skeletonLine: theme === "dark" ? "h-4 bg-slate-700 rounded w-3/4 mb-4" : "h-4 bg-slate-300 rounded w-3/4 mb-4",
  };

  return (
    <div className="flex items-start gap-3">
      <LiveOrbIcon isTyping />
      <div className="flex flex-col gap-2">
        <div className={themeClasses.bubble}>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-teal-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </div>
            <span className={themeClasses.text}>{stageMessages[stage]}</span>
          </div>
        </div>

        {stage === "organizing" && willShowProviders && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={themeClasses.skeleton}>
                <div className={themeClasses.skeletonLine} />
                <div className={`h-3 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"} rounded w-full mb-2`} />
                <div className={`h-3 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"} rounded w-2/3`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------- WelcomeScreen ------------------- */
const WelcomeScreen: React.FC<{ onSelect: (query: string) => void; theme: "light" | "dark"; userLocation: UserLocation | null }> = ({ onSelect, theme, userLocation }) => {
  const services = [
    { name: "Plumber", icon: PlumberIcon },
    { name: "Electrician", icon: ElectricianIcon },
    { name: "Barber", icon: BarberIcon },
    { name: "Handyman", icon: HandymanIcon },
    { name: "Cleaner", icon: CleanerIcon },
    { name: "Mechanic", icon: MechanicIcon },
  ];

  const themeClasses = {
    title: theme === "dark" ? "text-4xl md:text-5xl font-bold text-white" : "text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent",
    subtitle: theme === "dark" ? "text-slate-400 text-lg mt-3" : "text-slate-600 text-lg mt-3",
    serviceButton: theme === "dark" ? "group bg-slate-800/40 p-6 rounded-3xl border border-slate-700/60 shadow-lg shadow-black/20 text-center transition-all duration-300 hover:border-teal-500/50 hover:bg-slate-800/60" : "group bg-white/80 p-6 rounded-3xl border border-slate-300/60 shadow-lg shadow-gray-400/20 text-center transition-all duration-300 hover:border-blue-500/50 hover:bg-white/90",
    serviceText: theme === "dark" ? "font-semibold text-base text-slate-200 group-hover:text-white transition-colors" : "font-semibold text-base text-slate-700 group-hover:text-slate-800 transition-colors",
    locationInfo: theme === "dark" 
      ? "text-center mb-8 p-5 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg shadow-black/20" 
      : "text-center mb-8 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-300/50 shadow-lg shadow-gray-400/20",
    locationText: theme === "dark" ? "text-slate-400 text-sm font-medium" : "text-slate-600 text-sm font-medium",
    locationValue: theme === "dark" ? "text-white font-bold text-base mt-1" : "text-slate-800 font-bold text-base mt-1",
  };

  const locationDisplay = userLocation ? locationService.formatLocationForDisplay(userLocation) : "Location not set";

  return (
    <motion.div key="welcome-screen" className="w-full text-center p-4 space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className={themeClasses.title}>Hello, I'm Service AI</h1>
        <p className={themeClasses.subtitle}>What kind of help do you need today?</p>
      </motion.div>

      {userLocation && (
        <motion.div 
          className={themeClasses.locationInfo}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'bg-blue-500/20 text-blue-600'}`}>
              <LocationIcon />
            </div>
            <div className="text-left">
              <p className={themeClasses.locationText}>Searching services in</p>
              <p className={themeClasses.locationValue}>{locationDisplay}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
        {services.map((service) => (
          <motion.button 
            key={service.name} 
            onClick={() => onSelect(`${service.name} near me`)} 
            className={themeClasses.serviceButton} 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} 
            whileHover={{ y: -5, scale: 1.02 }} 
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex justify-center mb-4"><service.icon /></div>
            <span className={themeClasses.serviceText}>{service.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ------------------- InputForm ------------------- */
const InputForm: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  theme: "light" | "dark";
}> = ({ value, onChange, onSubmit, isLoading, theme }) => {
  const themeClasses = {
    container: theme === "dark"
      ? "bg-slate-800/40 backdrop-blur-md rounded-full p-2 border border-slate-700/60 focus-within:ring-2 focus-within:ring-teal-500/80 focus-within:border-teal-500/80 transition-all duration-300"
      : "bg-white/90 backdrop-blur-md rounded-full p-2 border border-slate-300/60 focus-within:ring-2 focus-within:ring-blue-500/80 focus-within:border-blue-500/80 transition-all duration-300",
    input: theme === "dark" ? "w-full bg-transparent px-5 py-2 text-slate-100 placeholder-slate-400 focus:outline-none" : "w-full bg-transparent px-5 py-2 text-slate-800 placeholder-slate-500 focus:outline-none",
    button: theme === "dark" ? "w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 transform hover:scale-110 disabled:opacity-40 disabled:scale-100 disabled:bg-slate-600" : "w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 transform hover:scale-110 disabled:opacity-40 disabled:scale-100 disabled:bg-slate-400",
  };

  return (
    <div className={themeClasses.container}>
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask for a plumber, electrician, etc..."
          className={themeClasses.input}
          disabled={isLoading}
        />
        <button onClick={onSubmit} disabled={isLoading || !value.trim()} className={themeClasses.button} aria-label="Send message">
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

/* ------------------- Main App ------------------- */
export default function App(): JSX.Element {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiStage, setAiStage] = useState<AiStage>("idle");
  const [willShowProviders, setWillShowProviders] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showEnhancedLocationModal, setShowEnhancedLocationModal] = useState(false);
  const [locationManuallySet, setLocationManuallySet] = useState(false);
  const [locationInitialized, setLocationInitialized] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollContainerRef, messages.length + (aiStage !== "idle" ? 1 : 0));
  const stageTimersRef = useRef<number[]>([]);

  // Initialize location on component mount
  useEffect(() => {
    if (!locationInitialized && user && userProfile) {
      setLocationInitialized(true);
      initializeUserLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  // Handle cases where userProfile.location becomes available after initial load
  useEffect(() => {
    if (user && userProfile?.location && !userLocation && !locationManuallySet) {
      console.log('Setting user location from updated profile:', userProfile.location);
      setUserLocation(userProfile.location);
      locationService.setCachedLocation(userProfile.location);
    }
  }, [user, userProfile?.location, userLocation, locationManuallySet]);

  const initializeUserLocation = useCallback(async () => {
    if (!user || locationManuallySet) {
      return;
    }

    console.log('Initializing user location once...');
    console.log('Current userProfile:', userProfile);
    console.log('userProfile.location:', userProfile?.location);

    try {
      // Check if user already has location in profile and it's recent
      if (userProfile?.location && locationService.isLocationRecent(userProfile.location)) {
        console.log('Using saved location from Firebase profile:', userProfile.location);
        setUserLocation(userProfile.location);
        locationService.setCachedLocation(userProfile.location);
        return;
      }

      // If we have a location but it's not recent, log that
      if (userProfile?.location) {
        console.log('Location exists in Firebase but is not recent, will fetch new GPS location');
      } else {
        console.log('No location found in Firebase profile, will fetch GPS location');
      }

      // Try to get GPS location directly without calling other functions
      try {
        const location = await locationService.getCurrentLocation();
        if (location && user) {
          console.log('Got GPS location during initialization:', location);
          setUserLocation(location);
          await locationService.saveUserLocation(user.uid, location);
          if (updateProfile) {
            await updateProfile({ location });
          }
        } else {
          setShowLocationModal(true);
        }
      } catch (error) {
        console.error('GPS error during initialization:', error);
        setShowLocationModal(true);
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      setShowLocationModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate function for manual GPS location requests (from header button)
  const handleManualGPSLocationRequest = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location && user) {
        setUserLocation(location);
        await locationService.saveUserLocation(user.uid, location);
        
        // Update the auth context profile to sync with UserProfileScreen
        if (updateProfile) {
          await updateProfile({ location });
        }
        
        // Mark location as manually set to prevent auto-fetching
        setLocationManuallySet(true);
        
        console.log('Manual GPS location updated successfully:', locationService.formatLocationForDisplay(location));
      }
    } catch (error) {
      console.error('Error getting manual GPS location:', error);
      setShowLocationModal(true);
    }
  };

  const handleManualLocationSelect = async (locationText: string) => {
    if (!user) return;
    
    try {
      const manualLocation = locationService.createManualLocation(locationText);
      console.log('Manual location created:', manualLocation);
      
      setUserLocation(manualLocation);
      await locationService.saveUserLocation(user.uid, manualLocation);
      
      // Update the auth context profile to sync with UserProfileScreen
      if (updateProfile) {
        await updateProfile({ location: manualLocation });
      }
      
      // Mark location as manually set to prevent auto-fetching
      setLocationManuallySet(true);
      
      setShowLocationModal(false);
      
      // Show a subtle notification that location was updated
      console.log('Location updated successfully:', locationService.formatLocationForDisplay(manualLocation));
    } catch (error) {
      console.error('Error saving manual location:', error);
      // Could show error toast here
    }
  };

  const formatLocationForAPI = (text: string): string => {
    // Handle "near me" by replacing with actual user location
    if (text.toLowerCase().includes('near me') && userLocation) {
      return text.replace(/near me/gi, `in ${locationService.formatLocationForAPI(userLocation)}`);
    }
    return text;
  };

  const themeClasses = {
    mainContainer: theme === "dark" ? "flex flex-col h-screen bg-slate-950 text-white overflow-hidden" : "flex flex-col h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 text-slate-800 overflow-hidden",
    header: theme === "dark" ? "sticky top-0 z-20 p-4 bg-slate-950/70 backdrop-blur-lg border-b border-slate-800/50" : "sticky top-0 z-20 p-4 bg-gradient-to-r from-gray-500/95 via-gray-600/95 to-gray-700/95 backdrop-blur-lg border-b border-gray-400/60 shadow-xl shadow-gray-600/40",
    headerTitle: theme === "dark" ? "font-semibold text-white" : "font-semibold bg-gradient-to-r from-gray-50 via-white to-gray-100 bg-clip-text text-transparent",
    headerSubtitle: theme === "dark" ? "text-sm text-slate-400" : "text-sm text-gray-200 font-medium",
    backButton: theme === "dark" ? "flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 shadow-sm" : "flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white hover:text-gray-100 transition-all duration-200 shadow-sm backdrop-blur-sm",
    footer: theme === "dark" ? "sticky bottom-0 z-20 p-4 bg-slate-950/70 backdrop-blur-lg" : "sticky bottom-0 z-20 p-4 bg-gradient-to-r from-slate-300/95 via-gray-200/90 to-slate-400/95 backdrop-blur-lg shadow-xl shadow-gray-700/40",
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || aiStage !== "idle") return;

    // Check if location is required for the query but not available
    if (text.toLowerCase().includes('near me') && !userLocation) {
      setShowLocationModal(true);
      return;
    }

    const willHaveProviders = /provider|plumb|electric|service|near|help|barber|clean|mechanic|repair|fix/i.test(text);
    setWillShowProviders(willHaveProviders);

    setMessages((prev) => prev.map((msg) => ({ ...msg, suggestionsVisible: false })));

    const userMessageId = Date.now();
    setMessages((prev) => [...prev, { id: userMessageId, sender: "user", text }]);
    setInputValue("");
    setAiStage("thinking");

    // clear existing timers
    stageTimersRef.current.forEach((t) => clearTimeout(t));
    stageTimersRef.current = [];
    stageTimersRef.current.push(window.setTimeout(() => setAiStage("searching"), 1200));
    stageTimersRef.current.push(window.setTimeout(() => setAiStage("organizing"), 2500));

    try {
      // Format the query to include actual location for "near me" queries
      const formattedQuery = formatLocationForAPI(text);
      
      const payload = { query: formattedQuery };
      console.debug("[chat] Sending payload to server:", payload);
      const resp = await fetch("https://web-production-b9056.up.railway.app/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || resp.statusText);
      }

      const data = await resp.json();
      console.debug("[chat] Received response from server:", data);

      const providers = Array.isArray(data.providers) && data.providers.length ? data.providers : null;
      const responseText = data.message ?? (providers ? `I found ${providers.length} providers.` : "I can certainly help. What service are you looking for today?");
      const suggestions = Array.isArray(data.suggestions) && data.suggestions.length ? data.suggestions : null;

      const aiMessage: Message = {
        id: userMessageId + 1,
        sender: "ai",
        text: "",
        fullText: responseText,
        providers,
        suggestions,
        suggestionsVisible: !!suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Record search activity if user is logged in
      if (user && user.uid) {
        try {
          const providersCount = providers ? providers.length : 0;
          const category = willHaveProviders ? 'service_search' : 'general';
          await UserActivityService.recordSearch(user.uid, formattedQuery, providersCount, category);
          console.debug("[activity] Search recorded:", { query: formattedQuery, providersFound: providersCount });
        } catch (activityError) {
          console.warn("[activity] Failed to record search:", activityError);
          // Don't throw error, just log it as activity tracking is not critical
        }
      }
    } catch (err) {
      console.error(err);
      const aiMessage: Message = {
        id: userMessageId + 1,
        sender: "ai",
        text: "",
        fullText: "I'm having trouble reaching the server. Please try again.",
        providers: null,
        suggestions: ["Plumber near me", "Electrician near me"],
        suggestionsVisible: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      stageTimersRef.current.forEach((t) => clearTimeout(t));
      stageTimersRef.current = [];
      setAiStage("idle");
      setWillShowProviders(false);
    }
  };

  const handleSuggestionSelect = (text: string, messageId: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, suggestionsVisible: false } : msg)));
    handleSendMessage(text);
  };

  return (
    <div className={themeClasses.mainContainer}>
      <GlobalStyles theme={theme} />
      <header className={themeClasses.header}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className={themeClasses.backButton}
              aria-label="Back to Dashboard"
            >
              <BackIcon />
            </button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20">S</div>
            <div>
              <h1 className={themeClasses.headerTitle}>Service Assistant</h1>
              <p className={themeClasses.headerSubtitle}>Your Local Provider Finder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LocationUpdateButton 
              userLocation={userLocation} 
              theme={theme} 
              onClick={() => setShowEnhancedLocationModal(true)} 
            />
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 space-y-8 max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 && <WelcomeScreen key="welcome" onSelect={handleSendMessage} theme={theme} userLocation={userLocation} />}

            {messages.map((message) => (
              <MessageBubble key={message.id} m={message} onSuggestionSelect={handleSuggestionSelect} theme={theme} />
            ))}

            {/* ---- IMPORTANT: render AI thinking bubble AFTER messages so it appears after the sent message ----
                Only fade it in/out (opacity) — no vertical 'y' or layout animation — to avoid jumps. */}
            {aiStage !== "idle" && messages.length > 0 && (
              <motion.div
                key="thinking-bubble-after"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <AIThinkingBubble stage={aiStage} willShowProviders={willShowProviders} theme={theme} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className={themeClasses.footer}>
        <div className="max-w-4xl mx-auto">
          <InputForm
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={() => handleSendMessage(inputValue)}
            isLoading={aiStage !== "idle"}
            theme={theme}
          />
        </div>
      </footer>

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleManualLocationSelect}
        theme={theme}
      />

      {/* Enhanced Location Modal */}
      <EnhancedLocationModal
        isOpen={showEnhancedLocationModal}
        onClose={() => setShowEnhancedLocationModal(false)}
        onManualLocationSelect={handleManualLocationSelect}
        onGPSLocationRequest={handleManualGPSLocationRequest}
        theme={theme}
      />
    </div>
  );
}
