import React from 'react';

// --- SVG ICON COMPONENTS ---
// Using SVG icons for a cleaner and more professional look than emojis.

const BookIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a7.5 7.5 0 007.5-7.5h-15a7.5 7.5 0 007.5 7.5z" />
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V9.75a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 9.75v8.5A2.25 2.25 0 006 20.25z" />
  </svg>
);

const BrainIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008H16.5v-.008z" />
    </svg>
);


const SparklesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.008v.008H16.5v-.008z" />
  </svg>
);

const HandClickIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 12h-2.25m-1.334 5.834l-1.591-1.591M4.5 12H2.25m1.334-5.834l1.591 1.591M12 21.75V19.5" />
    </svg>
);

const CreditCardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PrinterIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const HappyFaceIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


// Main App Component
export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <ProductPage />
    </div>
  );
}

// --- PRODUCT PAGE COMPONENT ---
const ProductPage = () => {
  return (
    <div className="font-sans text-gray-800">
      <ProductHero />
      <main className="container mx-auto px-6 py-12 md:py-20">
        <ProductIntroduction />
        <Benefits />
        <WhatsInside />
        <PurchaseProcess />
        <DetailedBenefits />
      </main>
      <FinalCTA />
      
    </div>
  );
};


// --- PAGE SECTION COMPONENTS ---

// 1. Hero Section
const ProductHero = () => {
  return (
    <header className="bg-amber-100 text-center py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
          संस्कृतं जीवनस्य सौन्दर्यम्
        </h1>
        <p className="text-lg md:text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
          Interactive worksheets + Early Sanskrit learning = a fun and enriching start for your child!
        </p>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-8">
          150+ Educational Activity Sheets with Sanskrit Vocabulary
        </p>
        <button className="bg-orange-500 text-white font-bold py-3 px-10 rounded-full hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-lg text-lg">
          BUY NOW AT ₹50
        </button>
      </div>
    </header>
  );
};

// 2. Product Introduction
const ProductIntroduction = () => {
  return (
    <section className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
       <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">A Gateway to India's Timeless Wisdom</h2>
       <p className="text-base md:text-lg text-gray-600 text-justify leading-relaxed">
        Sanskrit is widely regarded as one of the most scientific languages in the world. It offers a deep connection to India’s rich heritage, cultural values, and timeless wisdom. Varnika-1 is a thoughtfully curated collection of preschool activity sheets designed to introduce Sanskrit vocabulary to curious little minds in a systematic way that facilitates easy learning and retention.
       </p>
    </section>
  );
};


// 3. Benefits Section (Now with SVG Icons)
const Benefits = () => {
  const benefitsList = [
    { icon: <BookIcon className="w-12 h-12 text-blue-500" />, title: "Introduces Sanskrit Vocabulary", description: "Builds a strong foundation in language through structured learning." },
    { icon: <LeafIcon className="w-12 h-12 text-green-500" />, title: "Connects to Indian Heritage", description: "Fosters a deeper bond with India’s cultural and linguistic heritage." },
    { icon: <BrainIcon className="w-12 h-12 text-pink-500" />, title: "Boosts Cognitive Development", description: "Encourages logical thinking, memory, and focus." },
    { icon: <SparklesIcon className="w-12 h-12 text-yellow-500" />, title: "Blends Fun with Learning", description: "Engaging activity sheets designed to make early learning enjoyable." }
  ];

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Benefits of Varnika-1 Worksheets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefitsList.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 text-center flex flex-col items-center duration-500">
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. What's Inside Section
const WhatsInside = () => {
  const items = [
    "60 Colouring sheets with Sanskrit Vocabulary.",
    "40 General activity sheets.",
    "20 Math work sheets.",
    "40 Activity sheets on shapes, alphabets, and digits."
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 md:mb-24 border">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">What Will You Get Inside?</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-start p-4 bg-amber-50 rounded-lg">
                <span className="text-green-500 font-bold text-xl mr-4">✔</span>
                <span className="text-gray-700 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
    </section>
  );
};

// 5. Purchase Process Section (Now with SVG Icons)
const PurchaseProcess = () => {
  const steps = [
    { icon: <HandClickIcon className="w-10 h-10" />, title: "Click on Buy Now", description: "Start the process with a single click." },
    { icon: <CreditCardIcon className="w-10 h-10" />, title: "Complete Payment", description: "Securely pay through our payment gateway." },
    { icon: <DownloadIcon className="w-10 h-10" />, title: "Download", description: "Get instant access to your files after payment." },
    { icon: <PrinterIcon className="w-10 h-10" />, title: "Print", description: "Print the activity sheets whenever you need them." },
    { icon: <HappyFaceIcon className="w-10 h-10" />, title: "Play n Learn", description: "Enjoy a fun and enriching learning experience." }
  ];

  return (
    <section className="text-center mb-16 md:mb-24">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">The Purchase Process</h2>
      <p className="text-lg text-gray-600 mb-12">Simple, Secure, and Instant</p>
      <div className="relative">
        <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gray-300 border-t-2 border-dashed -z-10"></div>
        <div className="grid md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center p-4">
                <div className="bg-white rounded-full p-4 flex items-center justify-center mb-4 border-2 border-gray-200 shadow-sm text-gray-600">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Detailed Benefits Section
const DetailedBenefits = () => {
    return (
        <section className="bg-amber-50 rounded-2xl p-8 md:p-12 text-center max-w-5xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl font-bold mb-6">A Meaningful Start to Lifelong Learning</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-justify">
                Varnika-1 is a thoughtfully designed collection of activity sheets with Sanskrit vocabulary to enrich a child’s developmental journey. These worksheets enhance <strong>cognitive growth</strong>, improve <strong>fine motor skills</strong>, and encourage <strong>creativity and imagination</strong> through hands-on, engaging tasks. By introducing children to Sanskrit at an early age, Varnika-1 supports <strong>language development</strong>, builds <strong>memory and focus</strong>, and nurtures a connection to India’s rich cultural heritage. Each activity is crafted to boost <strong>confidence</strong>,inspire <strong>curiosity</strong>, and make learning a joyful experience.
            </p>
        </section>
    );
};

// 7. Final Call-to-Action Section
const FinalCTA = () => {
  return (
    <section className="bg-orange-500 text-white text-center py-16 md:py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start This Joyful Journey?</h2>
        <p className="text-lg md:text-xl mb-8">
          Give your child the gift of knowledge and culture.
        </p>
        <button className="bg-white text-orange-500 font-bold py-4 px-12 rounded-full hover:bg-amber-50 transition-transform transform hover:scale-105 shadow-2xl text-xl">
          Get Varnika-1 Now for just ₹50
        </button>
      </div>
    </section>
  );
};

// 8. Footer: The standard footer for the page.
// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white text-center py-6">
//       <p>&copy; {new Date().getFullYear()} Varnika. All Rights Reserved.</p>
//     </footer>
//   );
// };
