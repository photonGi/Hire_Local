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
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="animate-section">
            <h1 className={`text-4xl text-center md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Privacy{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              The privacy and security of your information is very important to us. Whether
you are accessing information, submitting a request to book a room or are a
member of one of our loyalty programmes, we want you to trust that the
information that you have provided to us is being properly managed and
protected. We have prepared this Privacy Statement to explain more about who
we are and how we collect and manage your information.
            </p>

            <h3 className={`text-2xl font-bold md:text-3xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Who we are</h3>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Information we collect and how we use and share it</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
             We collect and use personal information if you make a booking through our
reservation system. We generally collect this information directly from you, but
in some cases we may collect your information from other sources. In these
cases we always ask members to make sure anyone they refer is happy for their
personal information to be passed to us, and to direct friends to read this
privacy policy if they want to find out more about how we use their information.
We also collect information through our third party service providers' use of
technologies such as pixels, web beacons, tracking tools and similar
technologies. You do not have to provide us with your information although in
some cases, if you do not, it may mean that you are unable to use our services.
For example, we may be unable to complete any booking you may wish to
make, or you may be unable to participate in our loyalty programmes.
To learn more about how we collect, use and share your information, please
click the relevant section below
            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>We will also share your information with other third parties in
circumstances, such as:</h4>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>when we believe in good faith that the disclosure is required by law or to
protect the safety of hotel guests, employees, the public or our property.</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>when disclosure is required to comply with a judicial proceeding, court
order, subpoena, warrant or legal process; or
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>In the event of a merger, asset sale, or other related transaction.
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>For any reason that feels appropriate to the website owner</li>
            </ul>


            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}> 
There are other times when we collect and use personal information, for
example if you choose to participate in one of our competitions or sweepstakes,
sign up to receive our newsletters or other special offers and promotions,
download one of our mobile applications or participate in one of our other
services. In these instances, we will collect information from you for running
and administering the respective competition, sweepstakes or service that you
have elected to participate in. The information collected may include personal
details such as your name and address as well as certain demographic
information. In each case, we will collect, use and secure your information in a
manner consistent with the general principles set out in this Privacy Statement
unless we tell you otherwise.

            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We also collect information from you when you browse our website, use our
mobile applications or participate in certain hotel services. In these instances,
information such as your country information, internet protocol (“IP”) address,
media access control address and other characteristics about your system or
device may be automatically collected. This information is collected for
functional purposes as well as to improve your experience when using these
services. This information may also be used for aggregated trend and statistical
analysis, and for showing you more relevant advertisements and messages.
            </p>  
            
            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              The legal basis for processing your personal data: We are committed to
collecting and using your information in accordance with applicable data
protection laws.

            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We will only collect, use and share your information where we are satisfied that
we have an appropriate legal basis to do this. This may be because:
            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>you have provided your consent to us using the personal information</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>our use of your information is necessary to perform our contract with you,
for example, making and managing your booking and operating and
providing services in connection with our Loyalty Programme in
accordance with the terms of our agreement with you
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>our use of your information is necessary to meet responsibilities we have
to our regulators, tax officials, law enforcement, or otherwise meet our
legal responsibilities
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>our use of your information is in our legitimate interest as a commercial
organization, for example to operate and improve our services and to
keep people informed about our products and services (including for
profiling and targeted advertising) - in these cases we will look after your
information at all times in a way that is proportionate and respects your
privacy rights and you have a right to object to processing.
</li>
            </ul>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}> 
              If you would like to find out more about the legal basis for which we process
personal information, please contact our office. If you have provided your
consent to our processing of your information you can withdraw this consent at
any time by contacting our office.
            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Data transfer</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              As we operate via a global network of vendors, reservation and service centers,
data centres and hotels, it may be necessary to transfer your information to a
country outside of the country where it was originally collected or outside of
your country of residence or nationality. The information that you provide us
during the course of a reservation or through the provision of any other services
may be transferred to any of our websites or affiliated entities and hotels
around the world for the purposes of carrying out or facilitating these services.
It will also be necessary to transfer this information to third parties, including,
without limitation, our Franchisees, partners and third-party service providers.

            </p>

             <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Using our websites, mobile applications and other technology</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We and our third-party service providers use cookies, pixels, web beacons,
tracking tools and other similar technologies on our websites, mobile
applications and in other areas of our business to collect information and
provide you with the services that you have requested or participate in and to
provide targeted advertising. Subject to local consent requirements, we may
use this and other information we collect, such as a hashed email address, to
help us and our third-party service providers identify other devices that you use
(e.g., a mobile phone, tablet, other computer, etc.). We, and our third party
service providers, also may use the cross-device tracking and other information
we learn about you to serve targeted advertising on your devices. We also use
the information that we collect to improve our products and services as well as
your experience when visiting our websites and using our mobile applications.
For more information on these subjects, please click the relevant section below.
            </p>


            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Cookies and other tracking technologies</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              What is a cookie: A “cookie” is a small text file that is placed onto an Internet
user’s web browser or device and is used to remember as well as obtain
information about that party. You might be assigned a cookie when visiting our
websites or when using our mobile applications. In some instances, where
permitted under the applicable law, cookies may also be used for the purposes
of certain email campaigns.

            </p>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              What types of cookies we use and how we use them: We use three primary
types of cookies, which include:

            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Functional cookies: these cookies support the use of the website and
applications and enable certain features to enhance your experience. For
example, we use functional cookies to facilitate your reservation and to
remember your selections as you move from page to page. We also use
functional cookies for remembering things like your sign-in information
and hotel preferences to avoid you having to re-enter it.</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Performance cookies: these cookies collect information needed to
support the website and our applications and allow us to improve our
website and identify any problems that you faced while visiting us. For
example, performance cookies may provide us with information about
how you came to our website and how you navigated around our website
during your visit. We also use these cookies to provide us with certain
statistical and analytics information, such as how many visitors came to
our website or how effective our advertising is.
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Targeting cookies: these cookies are used to collect information from
you to help us to improve our products and services as well as serve you
with targeted advertisements that we believe will be relevant for you. We
use targeting cookies across our websites and applications for various
marketing initiatives and campaigns. For more information, please see the
“Targeted advertising” section below.
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Third-party cookies: As described above, we use a number of
third-party service providers to help us manage, carry out and improve
our advertising. These parties set cookies in our direction to help us
collect information and provide you with advertisements that we believe
would be relevant for you. In some instances these third parties may also
assist us by providing certain statistical and analytics information in
relation to our marketing practices. We also may share information
collected through cookies (and other tracking technologies) with third
parties to use for their own analytics and marketing purposes.
</li>

              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Managing cookies and opting out: You can choose to visit our web
sites without cookies, but in some cases certain services, features and
functionality may not be available. To visit without cookies, you can
configure your browser to reject all cookies or notify you when a cookie is
set. Each browser is different, so check the "Help" menu of your browser
to learn how to change your cookie preferences.

</li>

              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Other technologies: Other technologies such as pixels and web beacons
may also be used on our websites, mobile applications, in email messages
and in other areas of our business. These technologies are used to
improve our products and services as well as our marketing efforts.

</li>

              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Targeted Advertising: We and our third-party service providers may
serve targeted advertisements through the use of first-party or
third-party cookies, pixels and web beacons when you visit our website,
use our mobile applications, or visit third party websites. In some
instances, these cookies may be persistent cookies. As described in the
sections above, we and our third party service providers may also use
cookies and other information to try to identify other devices and web
browsers that you may use so we and our third-party service providers
may serve targeted advertisements to those devices. We do this to
provide you with advertising that we believe may be relevant for you as
well as improve our own products and services, including the functionality
and performance of our websites and mobile applications. To learn more
about opting out of certain types of targeted advertising, please see the
“Managing cookies and opting out” section above.

</li>
            </ul>


             <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>How we use the information we collect</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We use personal information only for the purposes described in this Policy,
except if otherwise disclosed to you at the time the data is collected or further
authorized by law or by you.
We use the personal information that we collect through this website to operate,
maintain, enhance and provide all features of the service, to provide services
and information that you request, to respond to comments and questions and to
provide support to users.
We use the personal information that we collect through this website to
understand and analyze the usage trends and preferences of our users, to
improve the website service.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>How we secure your information</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We are committed to protecting the confidentiality and security of the
information that you provide to us. To do this, technical, physical and
organizational security measures are put in place to protect against any
unauthorized access, disclosure, damage or loss of your information. The
collection, transmission and storage of information can never be guaranteed to
be completely secure, however, we take steps to ensure that appropriate
security safeguards are in place to protect your information.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>How we secure your information</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We are committed to protecting the confidentiality and security of the
information that you provide to us. To do this, technical, physical and
organizational security measures are put in place to protect against any
unauthorized access, disclosure, damage or loss of your information. The
collection, transmission and storage of information can never be guaranteed to
be completely secure, however, we take steps to ensure that appropriate
security safeguards are in place to protect your information.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Managing your preferences and information</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We want to ensure that you have the necessary tools at your disposal to control
the information that you provide to us, including how we communicate with you.
It is also important that you contact us to update your information if any of it is
inaccurate or changes. Please click the relevant section below to learn more
about how to control how we communicate with you and how to update, modify
and delete your information.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Children</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              Our websites are not intended for children and we do not intentionally solicit or
collect personal information from individuals under the age of 18. If we are
notified or otherwise discover that a minor’s personal information has been
improperly collected, we will take all commercially reasonable steps to delete
that information. In limited instances, we may have a campaign or programme
targeted towards children. In these instances details on the information
practices will be presented within the terms and conditions of the programme or
campaign.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Retaining your information in our systems</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
              We generally only keep your information for as long as is reasonably required
for the reasons explained in this privacy policy. In some cases we keep
transactional records (which may include your information) for longer periods if
necessary to meet legal, regulatory, tax or accounting needs. We will also retain
information if we reasonably believe there is a prospect of litigation.
We maintain a data retention policy which we apply to the records we hold.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>How to contact us</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             For any questions or concerns regarding this Privacy Statement or our data
privacy practices, please call our office.
            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Changes to this Privacy Statement</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             In some instances, we may have to change, modify or amend this Privacy
Statement in order to comply with the evolving regulatory environment or the
needs of our business. Subject to any applicable legal requirements to provide
additional notice, any changes to this Privacy Statement will be communicated
through our websites and mobile applications. You are encouraged to revisit our
privacy policy and legal section to review updated policy.

            </p>


        <h3 className={`text-2xl font-bold md:text-3xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Your rights under EU data protection laws</h3>

        <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You have legal rights under EU data protection laws in relation to your personal
information. Click on the links below to learn more about each right you may
have. To exercise any of your rights please contact our Data Protection Officer
by calling our office.

            </p>
            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>To access personal information</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can ask us to confirm whether or not we have and are using your personal
information and for a copy of your information.


            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>To correct / erase personal information</h4>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can ask us to correct any information about you which is incorrect. We will
be happy to rectify such information but would need to verify the accuracy of
the information first.
You can ask us to erase your information if you think we no longer need to use
it for the purpose we collected it from you. You can also ask us to erase your
information if you have either withdrawn your consent to us using your
information (if we originally asked for your consent to use your information), or
exercised your right to object to further legitimate use of your information, or
where we have used it unlawfully or where we are subject to a legal obligation
to erase your personal information.
We may not always be able to comply with your request, for example where we
need to keep using your information to comply with our legal obligation or
where we need to use your information to establish, exercise or defend legal
claims

            </p>

             <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>To restrict how we use personal information</h4>

             <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can ask us to restrict our use of your information in certain circumstances,
for example:
            </p>

            <ul className="pl-5">
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>where you think the information is inaccurate and we need to verify it;</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>where our use of your information is not lawful but you do not want us to
erase it;
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>where the information is no longer required for the purposes for which it
was collected but we need it to establish, exercise or defend legal claims;
or
</li>
              <li className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed list-disc ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>where you have objected to our use of your personal information but we
still need to verify if we have overriding grounds to use it.</li>
            </ul>

            <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             We can continue to use your information following a request for restriction
where we have your consent to use it; or we need to use it to establish,
exercise or defend legal claims, or we need to use it to protect the rights of
another individual or a company.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>To object to how we use your information</h4>

             <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can object to any use of your information which we have justified on the
basis of our legitimate interest, if you believe your fundamental rights and
freedoms to data protection outweigh our legitimate interest in using the
information. If you raise an objection, we may continue to use your information
if we can demonstrate that we have compelling legitimate interests to use the
information.
You can also require us to stop using your data for direct marketing purposes.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>To ask us to transfer your information to another organisation</h4>

             <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can ask us to provide your personal information to you in a structured,
commonly used, machine-readable format, or you can ask to have it transferred
directly to another data controller (e.g. another company).
You may only exercise this right where we use your information in order to
perform a contract with you, or where we asked for your consent to use your
information. This right does not apply to any information which we hold or
process that is not held in digital form.

            </p>

            <h4 className={`text-xl font-bold md:text-2xl max-w-5xl mx-auto leading-relaxed mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Right to obtain a copy of personal information safeguards used for
transfers outside your jurisdiction
</h4>

             <p className={`text-lg md:text-xl mb-8 max-w-5xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>  
             You can ask to obtain a copy of, or reference to, the safeguards under which
your personal information is transferred outside of the European Union.
We may redact data transfer agreements to protect commercial terms.
We may ask you for proof of identity when making a request to exercise any of
these rights. We do this to make sure that we only disclose information where
we know we are dealing with the right individual.
We will not ask for a fee, unless we think your request is unfounded, repetitive
or excessive. Where a fee is necessary, we will inform you before proceeding
with your request.
We aim to respond to all valid requests within one month. It may however take
us longer if the request is particularly complicated or you have made several
requests. We will let you know if we think a response will take longer than one
month. To help us respond more quickly, we may ask you to provide more detail
about what you want to receive or are concerned about.
We may not always be able to do what you have asked, for example if it would
impact the duty of confidentiality we owe to others, or if we are otherwise
legally entitled to deal with the request in a different way.
            </p>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default PrivacyPolicy;
