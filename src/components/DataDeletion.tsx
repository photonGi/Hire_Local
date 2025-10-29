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
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="animate-section">
            <h1 className={`text-4xl text-center md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Delete Your {" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Request permanent deletion of your account and personal data
            </p>

            <div className="">
              <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Important Notice</h4>
              <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
             Deleting your data is permanent and cannot be undone. This action will:
            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Permanently delete your account and all associated data
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Remove all conversation history and chat interactions
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Delete any uploaded documents or tax information

</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Revoke access to all HireLocal services
</li>
            </ul>
            </div>


            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Data Deletion Request</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
             We respect your right to control your personal data. If you wish to delete your account and all associated data from HireLocal, please fill out the form below. We will process your request in accordance with applicable privacy laws.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>What Will Be Deleted</h4>
           
            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Account information</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Personal preferences

</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Conversation history

</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Usage analytics
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Uploaded documents
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Authentication tokens</li>
            </ul>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Need Help?</h4>


            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>If you have questions about data deletion or need assistance, please contact our privacy team:

            </p>

            
            <p className={`text-lg md:text-xl mb-2 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              Email: support@hirelocal.hotelaiengine.com
            </p>
            <p className={`text-lg md:text-xl mb-2 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              Website: https://hirelocal.hotelaiengine.com/
            </p>

           
          </div>
        </div>
      </div>  
    </div>
  );
};

export default DataDeletion;
