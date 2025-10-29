import React from "react";
import { Navbar } from "./shared";
import { useTheme } from "../theme/useTheme";

const TermsOfServices: React.FC = () => {
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
              Terms of {' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Service
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Last updated: 10/28/2025
            </p>


            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>1. Acceptance of Terms</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
             By accessing and using HireLocal ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>2. Description of Service</h4>
           

          <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              HireLocal is an AI-powered conversational application designed to provide tax-related information and assistance. The Service includes:
            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>AI-powered tax consultation and guidance
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Document analysis and tax form assistance
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Personalized tax advice based on user inputs

</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Secure user authentication and data storage
</li>
            </ul>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>3. User Responsibilities</h4>


            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}> By using our Service, you agree to:
            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Provide accurate and truthful information
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Use the Service only for lawful purposes

</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Not attempt to gain unauthorized access to our systems


</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Not use the Service to transmit harmful or malicious content

</li>

              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Comply with all applicable laws and regulations

</li>
            </ul>


            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>4. Privacy and Data Protection</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Service, you consent to the collection and use of your information as outlined in our Privacy Policy.
            </p> 

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>5. Disclaimer of Professional Advice</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              IMPORTANT: HireLocal provides general tax information and guidance for educational purposes only. The Service does not constitute professional tax advice, legal advice, or financial planning services.
            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              You should always consult with qualified tax professionals, accountants, or legal advisors for specific tax situations. We are not responsible for any decisions made based on information provided by our Service.
            </p>  
            

             <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>6. Limitation of Liability
</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              To the fullest extent permitted by law, HireLocal and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>7. Service Availability
</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We strive to maintain high availability of our Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue the Service at any time.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>8. Intellectual Property

</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              The Service and its original content, features, and functionality are and will remain the exclusive property of HireLocal and its licensors. The Service is protected by copyright, trademark, and other laws.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>9. Account Termination

</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. You may also delete your account at any time through our data deletion page.



            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>10. Changes to Terms

</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.



            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>11. Governing Law

</h4>
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is incorporated, without regard to its conflict of law provisions.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>12. Contact Information

</h4>
            <p className={`text-lg md:text-xl mb-3 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServices;
