import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/pricing.css";

const PricingPlans = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const coachId = queryParams.get("coachId"); // Get the coachId from query params
  console.log(coachId);

  const handlePlanSelection = (plan) => {
    // Navigate to the payment page with the selected plan and coachId
    navigate("/payment", { state: { coachId, plan } });
  };

  return (
    <div className="pricing-plans-container">
      <h2 className="title">Choose your plan for Coach {coachId}</h2>
      <hr className="divider" />
      <div className="plans">
        {/* <PlanCard
          title="Free"
          price="$1"
          duration="per month"
          description="Perfect for beginners learning the game."
          buttonLabel="Get this plan"
          onSelect={() => handlePlanSelection("Free")}
        /> */}
        <PlanCard
          title="Standard"
          price="$9.99"
          duration="per month"
          description="Unlock advanced strategies and get regular feedback."
          buttonLabel="Get this plan"
          isRecommended={true}
          onSelect={() => handlePlanSelection("Standard")}
        />
        {/* <PlanCard
          title="Pro"
          price="$19.99"
          duration="per month"
          description="Access deep analysis tools and lessons from grandmasters."
          buttonLabel="Get this plan"
          onSelect={() => handlePlanSelection("Pro")}
        /> */}
      </div>
    </div>
  );
};

const PlanCard = ({ title, price, duration, description, buttonLabel, isRecommended, onSelect }) => (
  <div className={`plan-card ${isRecommended ? "recommended" : ""}`}>
    {isRecommended && <span className="recommended-badge">Recommended</span>}
    <h3>{title}</h3>
    <p className="price">{price}</p>
    <p className="duration">{duration}</p>
    <p className="description">{description}</p>
    <button className="plan-button" onClick={onSelect}>{buttonLabel}</button>
  </div>
);

export default PricingPlans;
