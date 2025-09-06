import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield, Bell, MapPin, User, Lock, LogOut, Edit3, Mail, Phone, CheckCircle2, ChevronDown, ChevronUp, Link2, Loader2, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/useTheme';
import { useAuth } from '../contexts/AuthContextHooks';
import { locationService } from '../services/LocationService';
import type { UserLocation } from '../types/firebase';

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; type?: 'success' | 'error' | 'info'; desc?: string }>>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ personal: true, location: false, accounts: true });
  
  // Initialize profile from Firebase user data
  const [profile, setProfile] = useState({
    name: userProfile?.displayName || user?.displayName || '',
    email: userProfile?.email || user?.email || '',
    phone: userProfile?.phone || '',
    accountType: userProfile?.accountType || 'Free',
    avatar: userProfile?.photoURL || user?.photoURL || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=240&h=240&fit=crop&crop=face',
    address: userProfile?.address || '',
    radiusKm: userProfile?.radiusKm || 25
  });
  
  const initialAccounts = userProfile?.connectedAccounts || { google: false, facebook: false };
  
  const [connectedAccounts, setConnectedAccounts] = useState(initialAccounts);

  // Dirty tracking state snapshots
  const [baseline, setBaseline] = useState({ profile, connectedAccounts });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Sync profile data when userProfile changes
  useEffect(() => {
    console.log('[UserProfileScreen] userProfile updated:', userProfile);
    console.log('[UserProfileScreen] userProfile.location:', userProfile?.location);
    if (userProfile) {
      setProfile({
        name: userProfile.displayName || user?.displayName || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        accountType: userProfile.accountType || 'Free',
        avatar: userProfile.photoURL || user?.photoURL || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=240&h=240&fit=crop&crop=face',
        address: userProfile.address || '',
        radiusKm: userProfile.radiusKm || 25
      });
      
      setConnectedAccounts(userProfile.connectedAccounts || { google: false, facebook: false });
    }
  }, [userProfile, user]);
  const ThemeToggle = () => (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg font-medium transition-all ${
        theme === 'dark' 
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
          : 'bg-slate-800/10 text-slate-800 hover:bg-slate-800/20 border border-slate-300'
      }`}
    >
       
    </button>
  );
  // Theme Toggle Button (for demo)


  // Animated mount
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeSlide {
        0%{opacity:0;transform:translateY(18px) scale(.97)}
        60%{opacity:.85;transform:translateY(-4px) scale(1.01)}
        100%{opacity:1;transform:translateY(0) scale(1)}
      } 
      .animate-section{animation:fadeSlide .65s cubic-bezier(.23,1,.32,1);} 
      .section-gradient:hover{border-color:rgba(255,255,255,.25);} 
      .section-gradient-light:hover{border-color:rgba(0,0,0,.15);} 
      .glass-input{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);} 
      .glass-input-light{background:rgba(255,255,255,0.7);border:1px solid rgba(0,0,0,0.08);backdrop-filter:blur(10px);} 
      .glass-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2);} 
      .glass-input-light:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,0.15);} 
      .toggle-base{transition:all .35s cubic-bezier(.23,1,.32,1);} 
      .gradient-ring{position:relative;} 
      .gradient-ring:before{content:'';position:absolute;inset:-2px;border-radius:inherit;padding:2px;background:linear-gradient(120deg,rgba(59,130,246,.6),rgba(147,51,234,.5),rgba(236,72,153,.5));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:.5s;} 
      .gradient-ring:hover:before{opacity:.9;}
      .gradient-ring-light{position:relative;} 
      .gradient-ring-light:before{content:'';position:absolute;inset:-2px;border-radius:inherit;padding:2px;background:linear-gradient(120deg,rgba(99,102,241,.4),rgba(139,92,246,.3),rgba(219,39,119,.3));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:.5s;} 
      .gradient-ring-light:hover:before{opacity:.6;}
      .focus-reset:focus{outline:none;box-shadow:none;}
      .silver-metallic {
        background: linear-gradient(135deg, 
          #f8fafc 0%, 
          #e2e8f0 20%, 
          #cbd5e1 40%, 
          #94a3b8 60%, 
          #64748b 80%, 
          #475569 100%
        );
        background-size: 200% 200%;
        animation: shimmer 3s ease-in-out infinite;
      }
      @keyframes shimmer {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .silver-card {
        background: linear-gradient(145deg, 
          rgba(248,250,252,0.9) 0%,
          rgba(226,232,240,0.8) 25%,
          rgba(203,213,225,0.7) 50%,
          rgba(148,163,184,0.6) 75%,
          rgba(100,116,139,0.5) 100%
        );
        backdrop-filter: blur(20px);
        border: 1px solid rgba(100,116,139,0.5);
        box-shadow: 
          inset 0 1px 0 rgba(255,255,255,0.8),
          0 8px 32px rgba(100,116,139,0.12);
      }
      .silver-button {
        background: linear-gradient(145deg, 
          #f1f5f9 0%,
          #e2e8f0 50%,
          #cbd5e1 100%
        );
        border: 1px solid rgba(148,163,184,0.4);
        color: #334155;
        transition: all 0.3s ease;
        box-shadow: 
          inset 0 1px 0 rgba(255,255,255,0.9),
          0 2px 8px rgba(100,116,139,0.15);
      }
      .silver-button:hover {
        background: linear-gradient(145deg, 
          #e2e8f0 0%,
          #cbd5e1 50%,
          #94a3b8 100%
        );
        box-shadow: 
          inset 0 1px 0 rgba(255,255,255,0.8),
          0 4px 16px rgba(100,116,139,0.25);
        transform: translateY(-1px);
      }
      .metallic-text {
        background: linear-gradient(135deg, #334155, #475569, #64748b, #94a3b8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
      }
      .light-bg {
        background: 
          radial-gradient(circle at 20% 80%, rgba(99,102,241,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(219,39,119,0.04) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      }
      .grayified-header {
        background: #475569;
        backdrop-filter: blur(24px);
        border-bottom: 1px solid rgba(71, 85, 105, 0.5);
        box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.6),
          0 4px 16px rgba(71, 85, 105, 0.4);
      }
      .grayified-footer {
        background: #475569;
        backdrop-filter: blur(24px);
        border-top: 1px solid rgba(71, 85, 105, 0.5);
        box-shadow: 
          inset 0 -1px 0 rgba(255, 255, 255, 0.6),
          0 -4px 16px rgba(71, 85, 105, 0.4);
      }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  const toggleExpand = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // Toast helper
  const pushToast = (title: string, type: 'success' | 'error' | 'info' = 'info', desc?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, title, type, desc }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  const guardEdit = (fn: () => void) => {
    if (!editing) {
      pushToast('Enable Edit Mode', 'info', 'Tap Edit to modify settings');
      return;
    }
    fn();
  };
  
  const toggleAccount = (key: 'google' | 'facebook') => guardEdit(() => {
    pushToast(`${connectedAccounts[key] ? 'Disconnecting' : 'Connecting'} ${key === 'google' ? 'Google' : 'Facebook'}...`, 'info');
    setTimeout(() => {
      setConnectedAccounts(a => ({ ...a, [key]: !a[key] }));
      pushToast(`${key === 'google' ? 'Google' : 'Facebook'} ${connectedAccounts[key] ? 'Disconnected' : 'Connected'}!`, 'success');
    }, 800);
  });

  const hasProfileChanged = useMemo(() => {
    // Compare profile excluding address field since it's handled separately
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address: _, ...profileForComparison } = profile;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars  
    const { address: __, ...baselineForComparison } = baseline.profile;
    return JSON.stringify(profileForComparison) !== JSON.stringify(baselineForComparison);
  }, [profile, baseline.profile]);
  const hasAccountsChanged = useMemo(() => JSON.stringify(connectedAccounts) !== JSON.stringify(baseline.connectedAccounts), [connectedAccounts, baseline.connectedAccounts]);
  const dirtySections = useMemo(() => {
    const arr:string[] = [];
    if (hasProfileChanged) arr.push('Profile');
    if (hasAccountsChanged) arr.push('Accounts');
    return arr;
  }, [hasProfileChanged, hasAccountsChanged]);
  const isDirty = dirtySections.length > 0;

  const simulateNetwork = (ms = 900) => new Promise(res => setTimeout(res, ms));

  const handleSave = async () => {
    if (!isDirty || !user) return;
    setSaving(true);
    pushToast('Saving changes...', 'info');
    
    try {
      // Prepare the profile data to save (excluding address since it's handled separately)
      const profileData = {
        displayName: profile.name,
        phone: profile.phone,
        accountType: profile.accountType,
        connectedAccounts: connectedAccounts,
        updatedAt: new Date()
      };
      
      // Update the profile in Firebase
      await updateProfile(profileData);
      
      setBaseline({ profile, connectedAccounts });
      setSaving(false);
      setEditing(false);
      setLastSaved(new Date());
      pushToast('Profile Updated', 'success', 'Your changes have been saved to Firebase');
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaving(false);
      pushToast('Save Failed', 'error', 'Failed to save changes. Please try again.');
    }
  };
  
  const handleCancel = () => {
    setProfile(baseline.profile);
    setConnectedAccounts(baseline.connectedAccounts);
    setEditing(false);
    pushToast('Reverted', 'info', 'All unsaved changes discarded');
  };

  const openPasswordModal = () => { setPwdForm({ current: '', next: '', confirm: '' }); setPwdError(null); setShowPwdModal(true); };
  
  const submitPassword = async () => {
    setPwdError(null);
    if (!pwdForm.current || !pwdForm.next) { setPwdError('Fill all fields'); return; }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError('Passwords do not match'); return; }
    setPwdSubmitting(true);
    await simulateNetwork(1100);
    setPwdSubmitting(false);
    setShowPwdModal(false);
    pushToast('Password Changed', 'success');
  };

  // Handle location update from address field
  const handleLocationUpdate = async () => {
    if (!profile.address.trim() || !user) return;
    
    try {
      // Create a new location from the address input
      const newLocation: UserLocation = locationService.createManualLocation(profile.address.trim());
      
      // Save the location using LocationService for consistency
      await locationService.saveUserLocation(user.uid, newLocation);
      
      // Update the profile with the new location
      await updateProfile({ location: newLocation });
      
      // Clear the address field since we've saved it as a proper location
      setProfile(prev => ({ ...prev, address: '' }));
      
      pushToast('Location Updated', 'success', 'Your location has been saved successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      pushToast('Location Update Failed', 'error', 'Failed to update location. Please try again.');
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    pushToast('Logging out...', 'info');
    
    try {
      await signOut();
      pushToast('Logged Out', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      pushToast('Logout Failed', 'error', 'Failed to sign out. Please try again.');
    }
  };

  const triggerAvatarUpload = () => guardEdit(() => fileInputRef.current?.click());
  
  const onAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUploading(true);
      try {
        // Convert file to base64 for storage
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64String = event.target?.result as string;
          
          // Update local state immediately for better UX
          setProfile(p => ({ ...p, avatar: base64String }));
          
          // Save to Firebase
          if (user) {
            await updateProfile({ photoURL: base64String });
            pushToast('Avatar Updated', 'success', 'Profile picture saved to Firebase');
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error updating avatar:', error);
        pushToast('Avatar Update Failed', 'error', 'Failed to save profile picture');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  const sectionWrapper = (id: string, title: string, icon: React.ReactNode, children: React.ReactNode, subtitle?: string) => (
    <div className={`relative rounded-2xl p-5 sm:p-6 ${theme === 'dark'
      ? 'bg-white/5 backdrop-blur-xl border border-white/10 section-gradient' 
      : 'silver-card section-gradient-light'
    } transition-all duration-300 animate-section ${expanded[id] ? (theme === 'dark' ? 'ring-1 ring-white/10' : 'ring-1 ring-slate-300/20') : ''}`}> 
      <button onClick={() => toggleExpand(id)} className="focus-reset w-full flex items-center justify-between group mb-3" aria-expanded={expanded[id]} aria-controls={`section-${id}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-purple-600/30' 
            : 'bg-gradient-to-br from-slate-400/40 via-slate-500/40 to-slate-600/40'
          } flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-slate-700'} shadow-inner`}>
            {icon}
          </div>
          <div className="text-left">
            <h3 className={`font-semibold text-sm sm:text-base tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
            {subtitle && <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-700/90'}`}>{subtitle}</p>}
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200/60'} flex items-center justify-center ${theme === 'dark' ? 'text-white/70 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-800'} transition-all ${expanded[id] ? 'rotate-180' : ''}`}>
          {expanded[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded[id] && <div id={`section-${id}`} className="mt-2 space-y-5">{children}</div>}
    </div>
  );

  return (
    <>
      <ThemeToggle />
      <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? '' : 'light-bg'}`}>
        {/* Dark Mode Backgrounds */}
        {theme === 'dark' && (
          <>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-28 -left-40 w-[520px] h-[520px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] bg-gradient-to-tr from-fuchsia-500/15 via-purple-500/10 to-sky-500/10 rounded-full blur-[140px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10 blur-[160px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(59,130,246,0.15),transparent_60%)]" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.07]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b111a] via-[#080e16] to-[#05080d]" />
          </>
        )}

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Fixed Header - DARK MODE (UNTOUCHED) */}
          {theme === 'dark' && (
            <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/10 px-4 py-3 sm:py-4 flex items-center justify-between transition-all duration-300">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">Profile</h1>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-blue-300/70">User Settings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditing(e=>{ if(!e) pushToast('Edit Mode Enabled','info','Update Profile'); else if(isDirty) pushToast('Unsaved Changes','info','Remember to save'); return !e;})} className="px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold relative group overflow-hidden transition-all">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:from-blue-500 group-hover:to-pink-500 transition" />
                  <span className="relative flex items-center gap-1.5 sm:gap-2 text-white">
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                    {editing ? 'Exit' : 'Edit'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Fixed Header - LIGHT MODE (GRAYIFIED) */}
          {theme === 'light' && (
            <div className="fixed top-0 left-0 right-0 z-50 grayified-header px-4 py-3 sm:py-4 flex items-center justify-between transition-all duration-300">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl silver-button hover:scale-105 transition-all flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </button>
                <div>
                  <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-white drop-shadow-sm">Profile</h1>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-slate-200/90">User Settings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditing(e=>{ if(!e) pushToast('Edit Mode Enabled','info','Changes are local only'); else if(isDirty) pushToast('Unsaved Changes','info','Remember to save'); return !e;})} className="px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold silver-button hover:scale-105 transition-all">
                  <span className="flex items-center gap-1.5 sm:gap-2 text-slate-700">
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
                    {editing ? 'Exit' : 'Edit'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 pt-20 sm:pt-24 pb-40 space-y-8">
            {/* Profile Header */}
            <div className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden ${theme === 'dark'
              ? 'bg-white/5 backdrop-blur-xl border border-white/10 gradient-ring' 
              : 'silver-card gradient-ring-light'
            } transition-all duration-300`}>
              {theme === 'dark' && (
                <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{backgroundImage:'radial-gradient(circle at 20% 25%, rgba(59,130,246,.25) 0, transparent 60%), radial-gradient(circle at 80% 35%, rgba(147,51,234,.25) 0, transparent 65%), radial-gradient(circle at 55% 85%, rgba(236,72,153,.25) 0, transparent 65%)'}} />
              )}
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  <img src={profile.avatar} alt={profile.name} className={`w-full h-full object-cover rounded-3xl shadow-2xl ${theme === 'dark' ? 'ring-4 ring-white/10' : 'ring-4 ring-slate-300/30'}`} />
                  <button onClick={triggerAvatarUpload} disabled={!editing} className={`absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl ${theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'silver-button'
                  } flex items-center justify-center shadow-xl ${theme === 'dark' ? 'border border-white/20' : ''} hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed`}>
                    {avatarUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarSelected} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h2 className={`text-2xl sm:text-3xl font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'metallic-text'}`}>{profile.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'silver-button text-slate-700'
                    }`}>{profile.accountType} ACCOUNT</span>
                  </div>
                  <div className={`flex flex-col sm:flex-row sm:items-center gap-4 text-sm ${theme === 'dark' ? 'text-blue-200/80' : 'text-slate-700'}`}>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.phone}</div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setEditing(true)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition ${theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-pink-500 text-white' 
                      : 'silver-button hover:scale-105'
                    }`} disabled={editing}>Edit Profile</button>
                    <button onClick={openPasswordModal} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${theme === 'dark' 
                      ? 'bg-white/10 hover:bg-white/15 text-white' 
                      : 'silver-button hover:scale-105'
                    }`}><Lock className="w-4 h-4" /> Change Password</button>
                    <button onClick={()=>setShowLogoutConfirm(true)} className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-sm font-semibold flex items-center gap-2 text-white transition hover:scale-105"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Sections */}
            {sectionWrapper('personal', 'Personal Information', <User className="w-5 h-5" />, (
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-700'}`}>Full Name</label>
                  <input disabled={!editing} value={profile.name} onChange={e=>setProfile(p=>({...p, name:e.target.value}))} className={`w-full rounded-xl px-4 py-3 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${theme === 'dark' 
                    ? 'glass-input text-white' 
                    : 'glass-input-light text-slate-800'
                  }`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-700'}`}>Email</label>
                  <input disabled value={profile.email} className={`w-full rounded-xl px-4 py-3 text-sm disabled:opacity-60 ${theme === 'dark' 
                    ? 'glass-input text-white' 
                    : 'glass-input-light text-slate-800'
                  }`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-700'}`}>Phone</label>
                  <input disabled={!editing} value={profile.phone} onChange={e=>setProfile(p=>({...p, phone:e.target.value}))} className={`w-full rounded-xl px-4 py-3 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${theme === 'dark' 
                    ? 'glass-input text-white' 
                    : 'glass-input-light text-slate-800'
                  }`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-700'}`}>Account Type</label>
                  <input disabled value={profile.accountType} className={`w-full rounded-xl px-4 py-3 text-sm disabled:opacity-60 ${theme === 'dark' 
                    ? 'glass-input text-white' 
                    : 'glass-input-light text-slate-800'
                  }`} />
                </div>
              </div>
            ), 'Manage the core details of your account')}

            {sectionWrapper('location', 'Location Preferences', <MapPin className="w-5 h-5" />, (
              <div className="space-y-6">
                {/* Current Location Display */}
                {userProfile?.location ? (
                  <div className={`p-4 rounded-xl border ${theme === 'dark' 
                    ? 'bg-blue-500/10 border-blue-400/20' 
                    : 'bg-slate-50 border-slate-200'
                  }`}>
                    <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/80' : 'text-slate-600'}`}>Current Location</label>
                    <div className="mt-2 flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-slate-200'}`}>
                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-300' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                          {userProfile.location.area && userProfile.location.area !== 'your area' && userProfile.location.area}
                          {userProfile.location.city && userProfile.location.city !== 'your location' && userProfile.location.city !== userProfile.location.area && 
                            (userProfile.location.area && userProfile.location.area !== 'your area' ? `, ${userProfile.location.city}` : userProfile.location.city)}
                          {userProfile.location.state && `, ${userProfile.location.state}`}
                          {userProfile.location.country && userProfile.location.country !== 'unknown' && `, ${userProfile.location.country}`}
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-500'}`}>
                          {userProfile.location.source === 'gps' ? '📍 GPS Location' : '✏️ Manual Entry'} • 
                          Updated {new Date(userProfile.location.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border ${theme === 'dark' 
                    ? 'bg-orange-500/10 border-orange-400/20' 
                    : 'bg-orange-50 border-orange-200'
                  }`}>
                    <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-orange-200/80' : 'text-orange-600'}`}>Location Status</label>
                    <div className="mt-2 flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>
                          No location set
                        </p>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-orange-200/60' : 'text-orange-600'}`}>
                          Visit the chat interface to set your location automatically or manually
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className={`text-xs font-medium tracking-wide ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-600'}`}>Update Location</label>
                  <div className="flex gap-2">
                    <input disabled={!editing} value={profile.address} onChange={e=>setProfile(p=>({...p, address:e.target.value}))} 
                      placeholder="Enter new location..."
                      className={`flex-1 rounded-xl px-4 py-3 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${theme === 'dark' 
                      ? 'glass-input text-white' 
                      : 'glass-input-light text-slate-800'
                    }`} />
                    <button 
                      onClick={handleLocationUpdate}
                      disabled={!editing || !profile.address.trim()}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed ${theme === 'dark'
                        ? 'bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 hover:text-teal-200'
                        : 'bg-blue-100/80 hover:bg-blue-200/80 border border-blue-300/60 text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      Save
                    </button>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-blue-200/50' : 'text-slate-500'}`}>
                    Enter a new location to update your current location. This will sync with your chat preferences.
                  </p>
                </div>
              </div>
            ), 'View and update your location')}

            {sectionWrapper('accounts', 'Connected Accounts', <Link2 className="w-5 h-5" />, (
              <div className="grid sm:grid-cols-2 gap-5">
                {[ 
                  { key:'google', label:'Google', desc:'Used for quick sign-in & syncing', color:'from-red-500 via-orange-500 to-yellow-500' },
                  { key:'facebook', label:'Facebook', desc:'Social login & profile sync', color:'from-blue-600 to-indigo-600' }
                ].map(acc => (
                  <div key={acc.key} className={`flex items-center justify-between p-4 rounded-xl border transition ${theme === 'dark' 
                    ? 'bg-white/5 border-white/10 hover:border-white/20' 
                    : 'bg-white/60 border-slate-200/50 hover:border-slate-300/60 backdrop-blur-sm'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white font-semibold text-sm`}>{acc.label.charAt(0)}</div>
                      <div>
                        <p className={`text-sm font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{acc.label} {connectedAccounts[acc.key as keyof typeof connectedAccounts] && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}</p>
                        <p className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-blue-200/60' : 'text-slate-600/80'}`}>{acc.desc}</p>
                      </div>
                    </div>
                    <button onClick={()=>toggleAccount(acc.key as 'google' | 'facebook')} disabled={!editing} className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${connectedAccounts[acc.key as keyof typeof connectedAccounts] ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : (theme === 'dark' 
                      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15' 
                      : 'silver-button hover:scale-105'
                    )} disabled:opacity-40 disabled:cursor-not-allowed`}>{connectedAccounts[acc.key as keyof typeof connectedAccounts] ? 'Connected' : 'Connect'}</button>
                  </div>
                ))}
              </div>
            ), 'Link accounts for faster access')}
          </div>

          {/* Bottom Floating Bar - DARK MODE (UNTOUCHED) */}
          {theme === 'dark' && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 bg-gradient-to-t from-black/85 via-black/60 to-transparent backdrop-blur-2xl border-t border-white/10 flex items-center justify-between gap-4 z-50 transition-all duration-300">
              <div className="flex-1 hidden sm:block">
                <p className="text-[11px] uppercase tracking-wider text-blue-200/60">Status</p>
                <p className="text-xs font-medium flex items-center gap-2 text-white">
                  <Shield className="w-3 h-3 text-emerald-400" /> 
                  Secure • 
                  <span className="text-blue-200/50">All changes local (mock)</span>
                  {lastSaved && <span className="text-blue-300/60"> • Saved {lastSaved.toLocaleTimeString()}</span>}
                </p>
              </div>
              <div className="flex-1 flex sm:justify-end gap-3">
                <button onClick={handleCancel} disabled={!editing || (!isDirty && !saving)} className={`h-11 px-5 rounded-2xl text-sm font-semibold transition relative overflow-hidden ${editing && (isDirty || saving) ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-white/5 opacity-40 cursor-not-allowed'}`}>{saving ? '...' : 'Cancel'}</button>
                <button onClick={handleSave} disabled={!editing || !isDirty || saving} className={`h-11 px-6 rounded-2xl text-sm font-semibold relative overflow-hidden group ${editing && isDirty && !saving ? 'text-white' : 'text-white/50 cursor-not-allowed'}`}>
                  <span className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 ${editing && isDirty && !saving ? 'group-hover:from-blue-500 group-hover:to-pink-500' : 'opacity-30'} transition`} />
                  <span className="relative flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'No Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Floating Bar - LIGHT MODE (GRAYIFIED) */}
          {theme === 'light' && (
            <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-4 grayified-footer flex items-center justify-between gap-4 z-50 transition-all duration-300">
              <div className="flex-1 hidden sm:block">
                <p className="text-[11px] uppercase tracking-wider text-slate-200/90">Status</p>
                <p className="text-xs font-medium flex items-center gap-2 text-white">
                  <Shield className="w-3 h-3 text-emerald-400" /> 
                  Secure • 
                  <span className="text-slate-200/80">All changes local (mock)</span>
                  {lastSaved && <span className="text-slate-200/70"> • Saved {lastSaved.toLocaleTimeString()}</span>}
                </p>
              </div>
              <div className="flex-1 flex sm:justify-end gap-3">
                <button onClick={handleCancel} disabled={!editing || (!isDirty && !saving)} className={`h-11 px-5 rounded-2xl text-sm font-semibold transition relative overflow-hidden ${editing && (isDirty || saving) ? 'bg-white/25 hover:bg-white/35 text-white border border-white/30' : 'bg-white/10 opacity-60 cursor-not-allowed text-white/60'}`}>{saving ? '...' : 'Cancel'}</button>
                <button onClick={handleSave} disabled={!editing || !isDirty || saving} className={`h-11 px-6 rounded-2xl text-sm font-semibold relative overflow-hidden group ${editing && isDirty && !saving ? 'text-white' : 'text-white/60 cursor-not-allowed'}`}>
                  <span className={`absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 ${editing && isDirty && !saving ? 'group-hover:from-slate-500 group-hover:to-slate-700' : 'opacity-40'} transition`} />
                  <span className="relative flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'No Changes'}</span>
                </button>
              </div>
            </div>
          )}
      
        {/* Toasts */}
        <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-[60] pointer-events-none">
          {toasts.map(t => (
            <div key={t.id} className={`pointer-events-auto w-[92%] sm:w-auto max-w-sm px-4 py-3 rounded-2xl backdrop-blur-xl border flex gap-3 items-start shadow-lg animate-section ${
              t.type==='success' ? 'border-emerald-400/30 bg-emerald-500/15' : 
              t.type==='error' ? 'border-red-400/30 bg-red-500/15' : 
              theme === 'dark' ? 'border-white/15 bg-white/10' : 'border-slate-300/40 bg-white/80'
            }`}> 
              <div className="mt-0.5">
                {t.type==='success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {t.type==='error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                {t.type==='info' && <Bell className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-300' : 'text-slate-600'}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.title}</p>
                {t.desc && <p className={`text-[11px] mt-0.5 leading-relaxed ${theme === 'dark' ? 'text-blue-200/70' : 'text-slate-600/80'}`}>{t.desc}</p>}
              </div>
              <button className={`${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-800'} transition`} onClick={()=>setToasts(ts=>ts.filter(x=>x.id!==t.id))}><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        {/* Change Password Modal */}
        {showPwdModal && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>!pwdSubmitting && setShowPwdModal(false)} />
            <div className={`relative ${theme === 'dark' 
              ? 'bg-[#0d1522]/95 border-white/10' 
              : 'bg-slate-50/95 border-slate-300/40'
            } border rounded-t-3xl sm:rounded-3xl w-full sm:w-[440px] p-6 space-y-5 animate-section backdrop-blur-2xl`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Change Password</h3>
                <button onClick={()=>!pwdSubmitting && setShowPwdModal(false)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/15' 
                  : 'silver-button hover:scale-105'
                }`}><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {['current','next','confirm'].map(f => (
                  <div key={f} className="space-y-1">
                    <label className={`text-[11px] tracking-wide uppercase font-medium ${theme === 'dark' ? 'text-blue-200/50' : 'text-slate-500'}`}>{f==='current'?'Current Password': f==='next' ? 'New Password' : 'Confirm Password'}</label>
                    <input 
                      type="password" 
                      value={pwdForm[f as keyof typeof pwdForm]} 
                      onChange={e=>setPwdForm(p=>({...p,[f]:e.target.value}))} 
                      disabled={pwdSubmitting} 
                      className={`w-full rounded-xl px-4 py-3 text-sm transition ${
                        theme === 'dark' 
                          ? 'bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-white/10' 
                          : 'bg-gray-50/80 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:bg-white/10'
                      }`} 
                    />
                  </div>
                ))}
                {pwdError && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {pwdError}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowPwdModal(false)} disabled={pwdSubmitting} className={`h-11 flex-1 rounded-2xl text-sm font-semibold disabled:opacity-40 transition ${theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/15 text-white' 
                  : 'silver-button hover:scale-105'
                }`}>Cancel</button>
                <button onClick={submitPassword} disabled={pwdSubmitting} className="h-11 flex-1 rounded-2xl text-sm font-semibold relative overflow-hidden group">
                  <span className={`absolute inset-0 ${theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' 
                    : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800'
                  } ${!pwdSubmitting && (theme === 'dark' ? 'group-hover:from-blue-500 group-hover:to-pink-500' : 'group-hover:from-slate-500 group-hover:to-slate-700')} transition`} />
                  <span className="relative flex items-center justify-center gap-2 text-white">{pwdSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} {pwdSubmitting ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
              <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-blue-200/40' : 'text-slate-500/70'}`}>Security tip: choose a strong password with at least 10 characters, mixing letters, numbers & symbols. This is a mock flow.</p>
            </div>
          </div>
        )}

        {/* Logout Confirm */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setShowLogoutConfirm(false)} />
            <div className={`relative ${theme === 'dark'
              ? 'bg-[#0d1522]/95 border-white/10' 
              : 'bg-slate-50/95 border-slate-300/40'
            } border rounded-t-3xl sm:rounded-3xl w-full sm:w-[420px] p-6 space-y-5 animate-section backdrop-blur-2xl`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}><AlertTriangle className="w-5 h-5 text-amber-400" /> Confirm Logout</h3>
                <button onClick={()=>setShowLogoutConfirm(false)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/15' 
                  : 'silver-button hover:scale-105'
                }`}><X className="w-4 h-4" /></button>
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-blue-100/70' : 'text-slate-600'}`}>You will be returned to the landing page. Session clearing is simulated here (no real auth yet).</p>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowLogoutConfirm(false)} className={`h-11 flex-1 rounded-2xl text-sm font-semibold transition ${theme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/15 text-white' 
                  : 'silver-button hover:scale-105'
                }`}>Cancel</button>
                <button onClick={handleLogout} className="h-11 flex-1 rounded-2xl text-sm font-semibold bg-red-600/80 hover:bg-red-600 flex items-center justify-center gap-2 text-white transition hover:scale-105">Logout</button>
              </div>
              <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-blue-200/40' : 'text-slate-500/70'}`}>Later we'll integrate real sign-out & token revocation.</p>
            </div>
          </div>
        )}

        {/* Dirty Badge */}
        {editing && isDirty && (
          <div className="fixed bottom-[108px] right-4 z-[65]">
            <div className={`px-4 py-2 rounded-full backdrop-blur-xl text-[11px] font-semibold tracking-wide shadow-lg flex items-center gap-2 ${theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white' 
              : 'bg-gradient-to-r from-slate-600/90 to-slate-700/90 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" /> {dirtySections.length} Unsaved • {dirtySections.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserProfileScreen;