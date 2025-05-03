import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { mihirBackend } from "../../config.js";

const PricingPlans = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [coachName, setCoachName] = useState("");
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const coachId = queryParams.get("coachId");

  useEffect(() => {
    // Fetch coach details when component mounts
    const fetchCoachDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://${mihirBackend}/coach/${coachId}`);
        // Get the coach's name from the user field that's populated
        const coach = response.data;
        setCoachName(coach.user.UserName || "Coach");
      } catch (error) {
        console.error("Error fetching coach details:", error);
        setCoachName("Coach"); // Fallback to generic name
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoachDetails();
    }
  }, [coachId]);

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
          {loading ? "Loading..." : `Choose your plan for ${coachName}`}
        </h2>
        
        <div className="h-1 w-20 sm:w-24 md:w-32 bg-green-500 mx-auto 
                      mb-6 sm:mb-8 md:mb-12 rounded-full animate-expand">
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center 
                      gap-4 sm:gap-6 md:gap-8">
          <PlanCard
            title="Standard"
            price="$9.99"
            duration="for 30 days"
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
