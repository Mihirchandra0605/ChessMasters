import UserModel from "../models/userModel.js";
import CoachDetails from "../models/CoachModel.js";

// Function to check if a subscription has expired (30 days)
export const isSubscriptionExpired = (subscribedAt) => {
  const subscriptionDate = new Date(subscribedAt);
  const currentDate = new Date();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  return (currentDate - subscriptionDate) > thirtyDaysInMs;
};

// Function to unsubscribe a player from a coach
export const unsubscribeExpiredSubscriptions = async () => {
  try {
    console.log("Checking for expired subscriptions...");
    const coaches = await CoachDetails.find({
      "subscribers.0": { $exists: true } // Only coaches with at least one subscriber
    });
    
    let expiredSubscriptionsCount = 0;
    
    for (const coach of coaches) {
      const expiredSubscribers = coach.subscribers.filter(sub => 
        isSubscriptionExpired(sub.subscribedAt)
      );
      
      if (expiredSubscribers.length > 0) {
        // Get IDs of players with expired subscriptions
        const expiredPlayerIds = expiredSubscribers.map(sub => sub.user);
        console.log(`Found ${expiredPlayerIds.length} expired subscriptions for coach ${coach._id}`);
        
        // Remove expired subscribers from coach
        coach.subscribers = coach.subscribers.filter(sub => 
          !isSubscriptionExpired(sub.subscribedAt)
        );
        await coach.save();
        
        // Remove coach from players' subscribedCoaches
        for (const playerId of expiredPlayerIds) {
          await UserModel.updateOne(
            { _id: playerId },
            { $pull: { subscribedCoaches: coach.user } }
          );
        }
        
        expiredSubscriptionsCount += expiredPlayerIds.length;
      }
    }
    
    console.log(`Removed ${expiredSubscriptionsCount} expired subscriptions`);
    return expiredSubscriptionsCount;
  } catch (error) {
    console.error("Error cleaning up expired subscriptions:", error);
    throw error;
  }
};

// Function to check if a specific player's subscription to a coach has expired
export const checkPlayerSubscriptionExpiry = async (playerId, coachUserId) => {
  try {
    const coach = await CoachDetails.findOne({ user: coachUserId });
    if (!coach) return false;
    
    const subscription = coach.subscribers.find(
      sub => sub.user.toString() === playerId
    );
    
    if (!subscription) return false;
    
    return isSubscriptionExpired(subscription.subscribedAt);
  } catch (error) {
    console.error("Error checking subscription expiry:", error);
    return false;
  }
}; 