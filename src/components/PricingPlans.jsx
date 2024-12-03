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
    <div className="bg-gradient-to-br from-green-500 to-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full animate-fade-in-down">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 animate-slide-in-left">Choose your plan for Coach {coachId}</h2>
        <div className="h-1 w-32 bg-green-500 mx-auto mb-12 rounded-full animate-expand"></div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
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
  <div className={`bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 animate-fade-in-up ${isRecommended ? "border-4 border-green-500" : ""}`}>
    {isRecommended && (
      <span className="bg-green-500 text-white py-1 px-4 rounded-full text-sm font-semibold absolute -top-3 left-1/3 transform -translate-x-1/2 animate-bounce">
        Recommended
      </span>
    )}
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4 animate-slide-in-right">{title}</h3>
      <p className="text-4xl font-bold text-green-600 mb-2 animate-zoom-in">{price}</p>
      <p className="text-gray-500 mb-6">{duration}</p>
      <p className="text-gray-600 mb-8">{description}</p>
    </div>
    <div className="space-y-4">
      <button
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 animate-pulse"
        onClick={onSelect}
      >
        {buttonLabel}
      </button>
      <button
        className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors duration-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        onClick={onBack}
      >
        Back to Dashboard
      </button>
    </div>
  </div>
);

export default PricingPlans;
