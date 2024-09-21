import React from "react";
import "./Pricing.css"; // Importing CSS for styling

const PricingPlans = () => {
  return (
    <div className="pricing-plans-container">
      <h2 className="title">Choose your plan</h2>
      <hr className="divider" />
      <div className="plans">
        {/* Free Plan */}
        <PlanCard
          title="Free"
          price="$0"
          duration="per month"
          description="Perfect for beginners learning the game. Access basic tutorials and play casual games to practice your skills."
          buttonLabel="Get this plan"
        />

        {/* Standard Plan */}
        <PlanCard
          title="Standard"
          price="$9.99"
          duration="per month"
          description="Participate in ranked games, unlock advanced strategies, and improve regular feedback and analysis."
          buttonLabel="Get this plan"
          isRecommended={true}
        />

        {/* Pro Plan */}
        <PlanCard
          title="Pro"
          price="$19.99"
          duration="per month"
          description="Deep analysis tools, and lessons from grandmasters. Fine-tune your game to reach the highest levels."
          buttonLabel="Get this plan"
        />
      </div>
    </div>
  );
};

// PlanCard Component
const PlanCard = ({ title, price, duration, description, buttonLabel, isRecommended }) => {
  return (
    <div className={`plan-card ${isRecommended ? "recommended" : ""}`}>
      {isRecommended && <span className="recommended-badge">Recommended</span>}
      <h3>{title}</h3>
      <p className="price">{price}</p>
      <p className="duration">{duration}</p>
      <p className="description">{description}</p>
      <button className="plan-button">{buttonLabel}</button>
    </div>
  );
};

export default PricingPlans;
