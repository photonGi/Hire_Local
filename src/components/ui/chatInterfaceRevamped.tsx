import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------- Types ------------------- */
/**
 * Type definition for a message sender.
 * @typedef {"user" | "ai"} Sender
 */
type Sender = "user" | "ai";

/**
 * Type definition for a service provider.
 * @typedef {Object} Provider
 * @property {string} name - The name of the provider.
 * @property {string} [phone] - The provider's phone number.
 * @property {string} [address] - The provider's address.
 * @property {string} [details] - A description of the provider's services.
 * @property {string} [location_note] - A note about the location accuracy.
 * @property {string} [confidence] - Confidence level of the result.
 */
interface Provider {
  name: string;
  phone?: string;
  address?: string;
  details?: string;
  location_note?: string;
  confidence?: string;
}

/**
 * Type definition for a chat message.
 * @typedef {Object} Message
 * @property {number} id - Unique identifier for the message.
 * @property {Sender} sender - The sender of the message.
 * @property {string} text - The short text displayed in the message.
 * @property {string} [fullText] - The full text for the revealed typing effect.
 * @property {Provider[] | null} [providers] - List of providers to display.
 * @property {string[] | null} [suggestions] - List of suggested user queries.
 * @property {boolean} [suggestionsVisible] - Controls the visibility of suggestions.
 */
interface Message {
  id: number;
  sender: Sender;
  text: string;
  fullText?: string;
  providers?: Provider[] | null;
  suggestions?: string[] | null;
  suggestionsVisible?: boolean;
}

/**
 * Type definition for the AI's processing stage.
 * @typedef {"idle" | "thinking" | "searching" | "organizing"} AiStage
 */
type AiStage = "idle" | "thinking" | "searching" | "organizing";

/* ------------------- Custom Hooks ------------------- */
/**
 * A custom hook to automatically scroll a container to the bottom.
 * @param {React.RefObject<HTMLElement>} ref - The ref to the scrollable container.
 * @param {unknown} dependency - A dependency to trigger the scroll effect.
 */
const useAutoScroll = (ref: React.RefObject<HTMLElement>, dependency: unknown) => {
  useLayoutEffect(() => {
    const scrollContainer = ref.current;
    if (!scrollContainer) return;

    let isUserScrolling = false;
    let scrollTimeout: number | undefined;

    const handleScroll = () => {
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      isUserScrolling = !atBottom;
      scrollTimeout = window.setTimeout(() => {
        if (!isUserScrolling) scrollToBottom();
      }, 1000);
    };

    const scrollToBottom = () => {
      if (!isUserScrolling) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Only auto-scroll if there is content (dependency > 0). This prevents
    // scrolling to bottom on initial load when welcome screen should be at top.
    if (typeof dependency === "number") {
      if (dependency > 0) scrollToBottom();
    } else {
      // If dependency isn't numeric, default to scrolling (fallback)
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


/* ------------------- Icons & Animated Avatars ------------------- */
const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ServiceIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-teal-300 shadow-inner">
    {children}
  </div>
);

const PlumberIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.5 14c.28 0 .5.22.5.5v2.5c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2v-2.5c0-.28.22-.5.5-.5s.5.22.5.5V17c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-2.5c0-.28.22-.5.5-.5zM4 14h6v2H4zM4 11h9v2H4zM4 8h12v2H4zM4 5h14v2H4z" /><path d="M16.5 14H15v-1.5c0-1.1-.9-2-2-2h-1c-1.1 0-2 .9-2 2V14h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1.5V12c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v1.5h1.5c.28 0 .5.22.5.5s-.22.5-.5.5z" /></svg></ServiceIconWrapper>;
const ElectricianIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 11-12h-9z" /></svg></ServiceIconWrapper>;
const HandymanIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.6-3.6a1 1 0 00-1.4-1.4l-1.6 1.6-1.6-1.6a1 1 0 00-1.4 0zM12.7 21.7a1 1 0 001.4 0l6-6a1 1 0 000-1.4l-1.6-1.6a1 1 0 00-1.4 0l-6 6a1 1 0 000 1.4z" /><path d="M2.3 13.3a1 1 0 000 1.4l6 6a1 1 0 001.4 0l1.6-1.6a1 1 0 000-1.4l-6-6a1 1 0 00-1.4 0l-1.6 1.6z" /></svg></ServiceIconWrapper>;
const CleanerIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></ServiceIconWrapper>;
const MechanicIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18.36 6.64a9 9 0 11-12.73 0" /><path d="M12 2v10" /></svg></ServiceIconWrapper>;
const BarberIcon = () => <ServiceIconWrapper><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88" /><path d="M14.47 14.48L20 20" /><path d="M8.12 8.12L12 12" /></svg></ServiceIconWrapper>;

const LiveOrbIcon: React.FC<{ isTyping?: boolean }> = ({ isTyping }) => (
  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg transition-all duration-300 ${isTyping ? "animate-pulse" : ""}`}>
    <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 animate-orb-glow relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full animate-orb-spin">
        <div className="w-1/2 h-full bg-white/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  </div>
);

// New glowing orb icon for the user
const UserGlowingOrbIcon: React.FC = () => (
  <div className="w-9 h-9 rounded-full flex-shrink-0 hidden sm:flex items-center justify-center shadow-md bg-white glowing-orb"></div>
);


/* ------------------- UI Components ------------------- */
const RevealedText: React.FC<{ text: string; onComplete: () => void; isTyping: boolean }> = ({ text, onComplete, isTyping }) => {
  const [display, setDisplay] = useState("");
  const typingRef = useRef<number | undefined>(undefined);
  const doneRef = useRef(false);

  useEffect(() => {
    // cleanup any existing interval
    if (typingRef.current) {
      window.clearInterval(typingRef.current);
      typingRef.current = undefined;
    }

    // If no text provided, clear
    if (!text) {
      setDisplay("");
      doneRef.current = true;
      return;
    }

    // If typing is disabled, immediately show full text and mark complete
    if (!isTyping) {
      setDisplay(text);
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
      return;
    }

    // Start reveal animation
    doneRef.current = false;
    setDisplay("");
    let i = 0;
    typingRef.current = window.setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        if (typingRef.current) {
          window.clearInterval(typingRef.current);
          typingRef.current = undefined;
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
        typingRef.current = undefined;
      }
    };
  }, [text, isTyping, onComplete]);

  return <span className="whitespace-pre-wrap">{display}</span>;
};


const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
    
    html, body {
      background: #000;
      overflow: hidden;
    }

    /* Subtle background gradient based on reference designs */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at top left, rgba(20, 184, 166, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at bottom right, rgba(239, 68, 68, 0.1) 0%, transparent 40%);
      z-index: -1;
      pointer-events: none;
    }
    
    @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes orb-glow { 0%, 100% { box-shadow: 0 0 12px rgba(20, 184, 166, 0.3), 0 0 4px rgba(20, 184, 166, 0.2); } 50% { box-shadow: 0 0 24px rgba(20, 184, 166, 0.6), 0 0 8px rgba(20, 184, 166, 0.3); } }
    @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse-white-glow {
        from { box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4); }
        to { box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px rgba(255, 255, 255, 0.6); }
    }
    
    .glowing-orb {
      animation: pulse-white-glow 2s infinite alternate;
    }

    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-orb-glow { animation: orb-glow 3s infinite ease-in-out; }
    .animate-orb-spin { animation: orb-spin 10s linear infinite; }
    ::-webkit-scrollbar { width: 6px; } 
    ::-webkit-scrollbar-track { background: transparent; } 
    ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 3px; }
  `}</style>
);

const ProviderCard: React.FC<{ provider: Provider }> = ({ provider }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongDetails = (provider.details?.length ?? 0) > 100;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
      }}
      className="flex flex-col h-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-5 shadow-lg shadow-black/20"
    >
      <div className="flex-grow">
        <h3 className="font-bold text-white text-lg">{provider.name}</h3>
        <div className="text-sm text-slate-400 mt-2">
          <p className={`${!expanded && isLongDetails ? "line-clamp-2" : ""}`}>{provider.details}</p>
          {isLongDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-teal-400 hover:text-teal-300 font-semibold text-xs transition-colors"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <PhoneIcon />
          <span>{provider.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <LocationIcon />
          <span>{provider.address}</span>
        </div>
      </div>
    </motion.div>
  );
};


const MessageBubble: React.FC<{ m: Message; onSuggestionSelect: (text: string, messageId: number) => void }> = React.memo(({ m, onSuggestionSelect }) => {
  const isUser = m.sender === "user";
  const [visibleProviders, setVisibleProviders] = useState(3);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (isUser || !m.fullText) {
      setIsTypingComplete(true);
    }
  }, [m, isUser]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`flex gap-3 ${isUser ? "items-end flex-row-reverse" : "items-start"}`}
    >
      {isUser ? <UserGlowingOrbIcon /> : <LiveOrbIcon />}
      <div className={`${m.providers ? 'w-full' : 'max-w-[85%] sm:max-w-[70%]'} flex flex-col items-start gap-3`}>
        <div className={`px-5 py-3 rounded-2xl text-base leading-relaxed shadow-md ${isUser ? "bg-white text-black rounded-br-lg" : "bg-slate-800/60 backdrop-blur-sm text-white rounded-bl-lg border border-slate-700/50"}`}>
          {m.sender === "ai" && m.fullText ? (
            <RevealedText text={m.fullText} onComplete={() => setIsTypingComplete(true)} isTyping={!isTypingComplete} />
          ) : (
            <span>{m.text}</span>
          )}
        </div>
        
        <AnimatePresence>
          {m.suggestions && m.suggestionsVisible && isTypingComplete && (
            <motion.div 
              className="flex flex-wrap gap-2"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            >
              {m.suggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => onSuggestionSelect(suggestion, m.id)}
                  className="bg-slate-800/40 text-slate-300 text-sm font-medium py-2 px-4 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
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
              key="provider-cards"
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {m.providers.slice(0, visibleProviders).map((p, idx) => (
                <ProviderCard key={p.name ?? idx} provider={p} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {m.providers && m.providers.length > visibleProviders && (
          <div className="w-full flex justify-center">
            <button
              onClick={() => setVisibleProviders(m.providers!.length)}
              className="bg-slate-700/80 text-teal-300 text-sm font-semibold py-2 px-6 rounded-full hover:bg-slate-700 transition-colors duration-200"
            >
              Show all ({m.providers.length})
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});


const AIThinkingBubble: React.FC<{ stage: Exclude<AiStage, "idle">; willShowProviders: boolean }> = ({ stage, willShowProviders }) => {
  const stageMessages = {
    thinking: "Understanding...",
    searching: "Searching providers...",
    organizing: "Organizing results...",
  };
  return (
    <motion.div
      layout
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <LiveOrbIcon isTyping={true} />
      <div className="flex flex-col gap-2">
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl rounded-bl-lg px-4 py-3 shadow-md border border-slate-700/50">
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
            <AnimatePresence mode="wait">
              <motion.span
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-slate-300"
                transition={{ duration: 0.2 }}
              >
                {stageMessages[stage]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        {stage === "organizing" && willShowProviders && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="bg-slate-800/40 rounded-3xl p-5 shadow-lg h-36 skeleton-pulse"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const WelcomeScreen: React.FC<{ onSelect: (query: string) => void }> = ({ onSelect }) => {
  const services = [
    { name: "Plumber", icon: PlumberIcon },
    { name: "Electrician", icon: ElectricianIcon },
    { name: "Barber", icon: BarberIcon },
    { name: "Handyman", icon: HandymanIcon },
    { name: "Cleaner", icon: CleanerIcon },
    { name: "Mechanic", icon: MechanicIcon },
  ];
  
  const locations = ["Near Me", "Lahore", "Kasur", "Sheikhupura"];

  return (
    <motion.div 
      key="welcome-screen"
      className="w-full text-center p-4 space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white">Hello, I'm Service AI</h1>
        <p className="text-slate-400 text-lg mt-3">What kind of help do you need today?</p>
      </motion.div>

      {/* Services Section */}
      <motion.div
        className="w-full grid grid-cols-2 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {services.map((service) => (
          <motion.button
            key={service.name}
            onClick={() => onSelect(`${service.name} near me`)}
            className="group bg-slate-800/40 p-6 rounded-3xl border border-slate-700/60 shadow-lg shadow-black/20 text-center transition-all duration-300 hover:border-teal-500/50 hover:bg-slate-800/60"
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            <div className="flex justify-center mb-4">{<service.icon />}</div>
            <span className="font-semibold text-base text-slate-200 group-hover:text-white transition-colors">{service.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Locations Section */}
      <motion.div
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
      >
        <h3 className="text-xl font-bold text-white mb-4">Or search by location</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
          {locations.map((location) => (
            <motion.button
              key={location}
              onClick={() => onSelect(location === "near me" ? "services near me" : `services in ${location}`)}
              className="bg-slate-800/40 text-slate-300 text-sm font-medium py-2 px-4 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors shadow-sm"
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              {location}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};


const InputForm: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}> = ({ value, onChange, onSubmit, isLoading }) => (
  <div className="bg-slate-800/40 backdrop-blur-md rounded-full p-2 border border-slate-700/60 focus-within:ring-2 focus-within:ring-teal-500/80 focus-within:border-teal-500/80 transition-all duration-300">
    <div className="flex items-center">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSubmit())}
        placeholder="Ask for a plumber, electrician, etc..."
        className="w-full bg-transparent px-5 py-2 text-slate-100 placeholder-slate-400 focus:outline-none"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 transform hover:scale-110 disabled:opacity-40 disabled:scale-100 disabled:bg-slate-600"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  </div>
);


/* ------------------- Main App Component ------------------- */
export default function App(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [aiStage, setAiStage] = useState<AiStage>("idle");
  const [willShowProviders, setWillShowProviders] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollContainerRef, messages.length + (aiStage !== "idle" ? 1 : 0));
  const stageTimersRef = useRef<number[]>([]);

  // ...existing code... (generateProviders removed; server provides providers now)

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || aiStage !== "idle") return;

    const willHaveProviders = /provider|plumb|electric|service|near|help|barber|clean|mechanic|repair|fix/i.test(text);
    setWillShowProviders(willHaveProviders);

    // Hide suggestions on previous messages
    setMessages((prev) => prev.map((msg) => ({ ...msg, suggestionsVisible: false })));

    const userMessageId = Date.now();
    setMessages((prev) => [...prev, { id: userMessageId, sender: "user", text }]);
    setInputValue("");
    setAiStage("thinking");

    // clear any existing timers
    stageTimersRef.current.forEach((t) => clearTimeout(t));
    stageTimersRef.current = [];
    stageTimersRef.current.push(window.setTimeout(() => setAiStage("searching"), 1200));
    stageTimersRef.current.push(window.setTimeout(() => setAiStage("organizing"), 2500));

    try {
      const payload = { query: text };
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
      // clear timers and reset stage
      stageTimersRef.current.forEach((t) => clearTimeout(t));
      stageTimersRef.current = [];
      setAiStage("idle");
      setWillShowProviders(false);
    }
  };

  const handleSuggestionSelect = (text: string, messageId: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, suggestionsVisible: false } : msg
      )
    );
    handleSendMessage(text);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      <GlobalStyles />
      <header className="sticky top-0 z-20 p-4 bg-slate-950/70 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20">S</div>
          <div>
            <h1 className="font-semibold text-white">Service Assistant</h1>
            <p className="text-sm text-slate-400">Your Local Provider Finder</p>
          </div>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 space-y-8 max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 && <WelcomeScreen key="welcome" onSelect={handleSendMessage} />}
            {messages.map((message) => (
              <MessageBubble key={message.id} m={message} onSuggestionSelect={handleSuggestionSelect} />
            ))}
            {aiStage !== "idle" && (
              <motion.div key="thinking-bubble" layout>
                <AIThinkingBubble stage={aiStage} willShowProviders={willShowProviders} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 p-4 bg-slate-950/70 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto">
          <InputForm
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={() => handleSendMessage(inputValue)}
            isLoading={aiStage !== "idle"}
          />
        </div>
      </footer>
    </div>
  );
}