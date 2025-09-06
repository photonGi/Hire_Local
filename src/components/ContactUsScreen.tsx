import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, MapPin, MessageCircle, User, Building, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import Navbar from './shared/Navbar';

const ContactUsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; type?: 'success' | 'error' | 'info'; desc?: string }>>([]);

  // Animated mount styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeSlide {
        0%{opacity:0;transform:translateY(24px) scale(.98)}
        60%{opacity:.85;transform:translateY(-2px) scale(1.01)}
        100%{opacity:1;transform:translateY(0) scale(1)}
      } 
      @keyframes slideUp {
        0%{opacity:0;transform:translateY(30px)}
        100%{opacity:1;transform:translateY(0)}
      }
      .animate-section{animation:fadeSlide .65s cubic-bezier(.23,1,.32,1);} 
      .animate-card{animation:slideUp .5s cubic-bezier(.23,1,.32,1);} 
      .glass-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);} 
      .glass-input-light{background:rgba(255,255,255,0.8);border:1px solid rgba(0,0,0,0.08);backdrop-filter:blur(10px);} 
      .glass-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2);outline:none;} 
      .glass-input-light:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15);outline:none;} 
      .contact-card {
        backdrop-filter: blur(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .contact-card:hover {
        transform: translateY(-4px);
      }
      .floating-gradient {
        background: radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%);
        animation: float 6s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  const pushToast = (title: string, type: 'success' | 'error' | 'info' = 'info', desc?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, title, type, desc }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      pushToast('Missing Information', 'error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setSubmitted(true);
      pushToast('Message Sent!', 'success', 'We\'ll get back to you within 24 hours');
    } catch {
      pushToast('Submission Failed', 'error', 'Please try again or contact us directly');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'bug', label: 'Report a Bug' }
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      value: 'hello@hirelocal.com',
      subtitle: 'Send us an email anytime',
      color: 'blue'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM PST',
      color: 'emerald'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Office',
      value: 'San Francisco, CA',
      subtitle: 'United States',
      color: 'purple'
    }
  ];

  if (submitted) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        <Navbar currentPage="contact" showCreateAccount={true} />
        
        {/* Dark Mode Backgrounds */}
        {theme === 'dark' && (
          <>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500/15 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 blur-[160px]" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07]" />
          </>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 sm:pt-28 md:pt-32 pb-12">
          <div className={`max-w-lg w-full rounded-3xl p-8 text-center animate-section contact-card ${theme === 'dark'
            ? 'bg-white/5 border border-white/10' 
            : 'bg-white/80 border border-white/20 shadow-2xl'
          }`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center relative ${theme === 'dark'
              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30'
              : 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200'
            }`}>
              <CheckCircle className={`w-10 h-10 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
            </div>
            
            <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Message Sent!
            </h1>
            
            <p className={`text-base mb-8 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Thank you for reaching out. We've received your message and will get back to you within 24 hours.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    inquiryType: 'general'
                  });
                }}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                Send Another Message
              </button>
              
              <button
                onClick={() => window.history.back()}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                  : 'bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 hover:shadow-md'
                }`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <Navbar currentPage="contact" showCreateAccount={true} />
      
      {/* Dark Mode Backgrounds */}
      {theme === 'dark' && (
        <>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl floating-gradient" />
            <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gradient-to-tr from-fuchsia-500/15 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 blur-[160px]" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07]" />
        </>
      )}

      <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <div className="animate-section">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Get in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Have questions about HireLocal? Want to partner with us? Or just want to say hello? 
              We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 space-y-12">
          {/* Contact Information Cards */}
          <div className="grid gap-6 md:gap-8 sm:grid-cols-3">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`p-6 rounded-3xl transition-all duration-500 animate-card contact-card ${theme === 'dark'
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-white/80 border border-white/20 shadow-lg hover:shadow-xl'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center ${
                  info.color === 'blue' 
                    ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    : info.color === 'emerald'
                    ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                    : theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  {info.icon}
                </div>
                <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {info.title}
                </h3>
                <p className={`font-semibold mb-1 ${
                  info.color === 'blue' 
                    ? 'text-blue-500'
                    : info.color === 'emerald'
                    ? 'text-emerald-500'
                    : 'text-purple-500'
                }`}>
                  {info.value}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className={`rounded-3xl p-8 md:p-12 transition-all duration-500 animate-section contact-card ${theme === 'dark'
            ? 'bg-white/5 border border-white/10'
            : 'bg-white/80 border border-white/20 shadow-2xl'
          }`}>
            <div className="mb-10 text-center">
              <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${theme === 'dark'
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300'
                : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
              }`}>
                <MessageCircle className="w-10 h-10" />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Send us a Message
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all ${theme === 'dark' 
                        ? 'glass-input text-white placeholder-slate-400' 
                        : 'glass-input-light text-slate-800 placeholder-slate-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all ${theme === 'dark' 
                        ? 'glass-input text-white placeholder-slate-400' 
                        : 'glass-input-light text-slate-800 placeholder-slate-500'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phone and Inquiry Type Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all ${theme === 'dark' 
                        ? 'glass-input text-white placeholder-slate-400' 
                        : 'glass-input-light text-slate-800 placeholder-slate-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                    Inquiry Type
                  </label>
                  <div className="relative">
                    <Building className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all appearance-none ${theme === 'dark' 
                        ? 'glass-input text-white' 
                        : 'glass-input-light text-slate-800'
                      }`}
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value} className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-3">
                <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className={`w-full px-4 py-4 rounded-xl text-base transition-all ${theme === 'dark' 
                    ? 'glass-input text-white placeholder-slate-400' 
                    : 'glass-input-light text-slate-800 placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label className={`text-sm font-semibold tracking-wide ${theme === 'dark' ? 'text-blue-200' : 'text-slate-700'}`}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  className={`w-full px-4 py-4 rounded-xl text-base transition-all resize-none ${theme === 'dark' 
                    ? 'glass-input text-white placeholder-slate-400' 
                    : 'glass-input-light text-slate-800 placeholder-slate-500'
                  }`}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 transform ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed scale-95' 
                    : theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-2xl hover:scale-105'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg hover:shadow-2xl hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-[60] pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto w-full sm:w-auto max-w-sm px-6 py-4 rounded-2xl backdrop-blur-xl border flex gap-4 items-start shadow-xl animate-section ${
            t.type==='success' ? 'border-emerald-400/30 bg-emerald-500/20' : 
            t.type==='error' ? 'border-red-400/30 bg-red-500/20' : 
            theme === 'dark' ? 'border-white/15 bg-white/10' : 'border-slate-300/40 bg-white/90'
          }`}> 
            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
              t.type==='success' ? 'bg-emerald-400' : 
              t.type==='error' ? 'bg-red-400' : 
              theme === 'dark' ? 'bg-blue-400' : 'bg-slate-600'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.title}</p>
              {t.desc && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUsScreen;
