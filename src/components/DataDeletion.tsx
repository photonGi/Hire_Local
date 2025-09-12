import React from "react";
import { Navbar } from "./shared";
import { useTheme } from "../theme/useTheme";

const DataDeletion: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <Navbar currentPage="privacy-policy" showCreateAccount={true} />
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
              User Data Deletion {' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Instructions
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              HireLocal respects your privacy and provides you with the ability to request deletion of your data at any time. If you have used Facebook Login to sign in to our application and wish to delete your data, you can do so in one of the following ways:
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              <b>1. Automatic Deletion:</b> When you remove the HireLocal app from your Facebook account settings, all information we have received through Facebook Login will be automatically deleted from our systems. 
            </p>

            
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              <b>2. Manual Request:</b> You may also request deletion of your account and data by contacting us directly: info@hirelocal.com. 
              Please include the email address associated with your Facebook account when submitting your request. We will process your request and delete your data within 7 business days.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              <b>3. Scope of Deletion:</b> Your Facebook login information will be removed from our authentication system. Any personal data retrieved from Facebook (name, email, profile picture) will no longer be stored. Some anonymized, aggregated data (not personally identifiable) may remain for analytics purposes.
            </p>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default DataDeletion;
