import React from "react";
import { Navbar } from "./shared";
import { useTheme } from "../theme/useTheme";

const PrivacyPolicy: React.FC = () => {
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
              Privacy{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Privacy Policy Effective Date: September 1,2025 At HireLocalGPT (“we”, “our”,
              “us”), we respect your privacy. This Privacy Policy explains how we
              collect, use, and protect your information when you use our application.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              1. Information We Collect When you log in with Facebook Login, we may
              collect the following information (depending on your permissions): Your
              name Your email address Your public profile picture We do not collect
              sensitive personal information such as your password, payment details, or
              private messages.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}> 
              2. How We Use Your Information We use the information
              provided by Facebook only to: Authenticate your login Personalize your
              experience in our application Provide customer support if needed We do not
              sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              3. Data Storage and Security Your data is securely
              stored and protected. We take reasonable technical and organizational
              measures to safeguard your information against unauthorized access,
              disclosure, alteration, or destruction.
            </p>  
            
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              4. Sharing of Information We may share your information only when: Required by law Necessary to protect our
              legal rights With your explicit consent
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              5. Your Rights You have the right to: Request access to the information we store about you Request
              correction or deletion of your information Withdraw your consent for data
              use
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}> 
              6. Third-Party Services Our app uses Facebook Login as an
              authentication service. Your use of Facebook is subject to Facebook’s own
              Privacy Policy.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              7. Changes to this Policy We may update this Privacy
              Policy from time to time. Updates will be posted on this page with a new
              effective date.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              8. Contact Us If you have any questions about this Privacy
              Policy, please contact us at: 📧 info@hirelocal.com
            </p>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default PrivacyPolicy;
