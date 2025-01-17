// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "../styles/pricing.css";

// const PricingPlans = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Extract the query parameters from the URL
//   const queryParams = new URLSearchParams(location.search);
//   const coachId = queryParams.get("coachId"); // Get the coachId from query params
//   console.log(coachId);

//   const handlePlanSelection = (plan) => {
//     // Navigate to the payment page with the selected plan and coachId
//     navigate("/payment", { state: { coachId, plan } });
//   };

//   return (
//     <div className="pricing-plans-container">
//       <h2 className="title">Choose your plan for Coach {coachId}</h2>
//       <hr className="divider" />
//       <div className="plans">
//         {/* <PlanCard
//           title="Free"
//           price="$1"
//           duration="per month"
//           description="Perfect for beginners learning the game."
//           buttonLabel="Get this plan"
//           onSelect={() => handlePlanSelection("Free")}
//         /> */}
//         <PlanCard
//           title="Standard"
//           price="$9.99"
//           duration="per month"
//           description="Unlock advanced strategies and get regular feedback."
//           buttonLabel="Get this plan"
//           isRecommended={true}
//           onSelect={() => handlePlanSelection("Standard")}
//         />
//         {/* <PlanCard
//           title="Pro"
//           price="$19.99"
//           duration="per month"
//           description="Access deep analysis tools and lessons from grandmasters."
//           buttonLabel="Get this plan"
//           onSelect={() => handlePlanSelection("Pro")}
//         /> */}
//       </div>
//     </div>
//   );
// };

// const PlanCard = ({ title, price, duration, description, buttonLabel, isRecommended, onSelect }) => (
//   <div className={`plan-card ${isRecommended ? "recommended" : ""}`}>
//     {isRecommended && <span className="recommended-badge">Recommended</span>}
//     <h3>{title}</h3>
//     <p className="price">{price}</p>
//     <p className="duration">{duration}</p>
//     <p className="description">{description}</p>
//     <button className="plan-button" onClick={onSelect}>{buttonLabel}</button>
//   </div>
// );

// export default PricingPlans;



import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PricingPlans = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const coachId = queryParams.get("coachId");
  console.log(coachId);

  const handlePlanSelection = (plan) => {
    navigate("/payment", { state: { coachId, plan } });
  };

  const handleBackToDashboard = () => {
    navigate(`/Coachdash/${coachId}`);
  };

  return (
    <div className="bg-gradient-to-br from-green-500 to-black min-h-screen 
                    flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl 
                    shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 
                    max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl w-full 
                    animate-fade-in-down">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center 
                     text-gray-800 mb-4 sm:mb-6 md:mb-8 animate-slide-in-left">
          Choose your plan for Coach {coachId}
        </h2>
        
        <div className="h-1 w-20 sm:w-24 md:w-32 bg-green-500 mx-auto 
                      mb-6 sm:mb-8 md:mb-12 rounded-full animate-expand">
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center 
                      gap-4 sm:gap-6 md:gap-8">
          <PlanCard
            title="Standard"
            price="$9.99"
            duration="per month"
            description="Unlock advanced strategies and get regular feedback."
            buttonLabel="Get this plan"
            isRecommended={true}
            onSelect={() => handlePlanSelection("Standard")}
            onBack={handleBackToDashboard}
          />
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ title, price, duration, description, buttonLabel, isRecommended, onSelect, onBack }) => (
  <div className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 
                   shadow-lg sm:shadow-xl transition-all duration-300 
                   hover:shadow-2xl transform hover:-translate-y-2 
                   animate-fade-in-up relative w-full max-w-sm 
                   ${isRecommended ? "border-2 sm:border-4 border-green-500" : ""}`}>
    {isRecommended && (
      <span className="bg-green-500 text-white py-1 px-3 sm:px-4 
                     rounded-full text-xs sm:text-sm font-semibold 
                     absolute -top-3 left-1/3 transform -translate-x-1/2 
                     animate-bounce whitespace-nowrap">
        Recommended
      </span>
    )}
    
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 
                   mb-2 sm:mb-4 animate-slide-in-right">
        {title}
      </h3>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 
                  mb-1 sm:mb-2 animate-zoom-in">
        {price}
      </p>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        {duration}
      </p>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        {description}
      </p>
    </div>
    
    <div className="space-y-3 sm:space-y-4">
      <button
        className="w-full bg-green-600 text-white py-2 sm:py-3 
                 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base
                 transition-colors duration-300 hover:bg-green-700 
                 focus:outline-none focus:ring-2 focus:ring-green-500 
                 focus:ring-opacity-50 animate-pulse"
        onClick={onSelect}
      >
        {buttonLabel}
      </button>
      
      <button
        className="w-full bg-gray-200 text-gray-700 py-2 sm:py-3 
                 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base
                 transition-colors duration-300 hover:bg-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-gray-400 
                 focus:ring-opacity-50"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

export default PricingPlans;



//import React from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const PricingPlans = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const coachId = searchParams.get('coachId');

//   const handleSubscribe = (plan) => {
//     navigate('/payment', { state: { coachId, plan } });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 
//                     py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8 sm:mb-12 md:mb-16">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold 
//                        text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
//             Choose Your Plan
//           </h1>
//           <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
//             Select the perfect subscription plan that matches your chess learning goals
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
//           {/* Basic Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-500 to-indigo-600">
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Basic Plan</h2>
//               <p className="mt-2 text-purple-100 text-sm sm:text-base">Perfect for beginners</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$9.99/month</p>
//             </div>
//             <div className="p-6 sm:p-8 space-y-4">
//               <ul className="space-y-3 text-sm sm:text-base">
//                 <li className="flex items-center">
//                   <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
//                   </svg>
//                   Basic video lessons
//                 </li>
//                 {/* Add other list items similarly */}
//               </ul>
//               <button
//                 onClick={() => handleSubscribe('basic')}
//                 className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-purple-600 text-white 
//                          rounded-lg font-semibold hover:bg-purple-700 
//                          transition-colors duration-300 text-sm sm:text-base"
//               >
//                 Subscribe Now
//               </button>
//             </div>
//           </div>

//           {/* Premium Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300 
//                         border-4 border-yellow-400">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-yellow-400 to-orange-500">
//               <div className="absolute top-0 right-0 mt-4 mr-4">
//                 <span className="bg-yellow-200 text-yellow-800 text-xs sm:text-sm px-2 py-1 
//                                rounded-full font-semibold">
//                   Popular
//                 </span>
//               </div>
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Premium Plan</h2>
//               <p className="mt-2 text-yellow-100 text-sm sm:text-base">For serious players</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$19.99/month</p>
//             </div>
//             {/* Add Premium plan content similarly */}
//           </div>

//           {/* Pro Plan */}
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform 
//                         hover:scale-105 transition-transform duration-300">
//             <div className="p-6 sm:p-8 bg-gradient-to-br from-pink-500 to-rose-600">
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Pro Plan</h2>
//               <p className="mt-2 text-pink-100 text-sm sm:text-base">For elite players</p>
//               <p className="mt-4 text-2xl sm:text-3xl font-bold text-white">$29.99/month</p>
//             </div>
//             {/* Add Pro plan content similarly */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingPlans;
