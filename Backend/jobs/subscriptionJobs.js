import { unsubscribeExpiredSubscriptions } from "../utils/subscriptionUtils.js";

// Function to start the subscription cleanup job
export const startSubscriptionCleanupJob = () => {
  console.log("Starting subscription cleanup job...");
  
  // Run immediately when the server starts
  unsubscribeExpiredSubscriptions();
  
  // Run daily (24 hours = 86400000 ms)
  // 1min = 60000ms for testing
  setInterval(async () => {
    try {
      console.log("Running scheduled subscription cleanup...");
      await unsubscribeExpiredSubscriptions();
    } catch (error) {
      console.error("Error in subscription cleanup job:", error);
    }
  }, 86400000);
}; 