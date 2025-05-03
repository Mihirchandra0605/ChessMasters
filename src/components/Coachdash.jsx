import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarPlay from "./navbarplay";
import axios from "axios";
import { motion } from "framer-motion";
import { mihirBackend } from "../../config";

const Coachdash = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [subscribedcoaches , setsubscribedcoaches] = useState([])
  const [loading, setLoading] = useState(true);
  const [user , setuser]= useState("")
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchCoachDetails = async () => {
  //     try {
  //       const response = await axios.get(`http://${mihirBackend}/coach/${id}`);
  //       setProfileData(response.data);      
  //       setsubscribedcoaches(response.data.subscribers);

  //     } catch (err) {
  //       setError("Error fetching coach details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   const fetchDtails = async()=>{
  //     try {
  //       const response = await axios.get(`http://${mihirBackend}/auth/details`, { withCredentials: true });
  //       setuser(response.data._id)        
  //     } catch (err) {
  //       console.log(err);
  //       setError("Error fetching coach details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchDtails()
  //   fetchCoachDetails();
  // }, [id]);
  
  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        const response = await axios.get(`http://${mihirBackend}/coach/${id}`);
        
        // Extract only the user IDs from the subscribers array
        const subscribersList = response.data.subscribers.map(subscriber => subscriber.user);
        
        setProfileData(response.data);      
        setsubscribedcoaches(subscribersList);

      } catch (err) {
        setError("Error fetching coach details");
      } finally {
        setLoading(false);
      }
    };

    const fetchDtails = async () => {
      try {
        const response = await axios.get(`http://${mihirBackend}/auth/details`, { withCredentials: true });
        setuser(response.data._id);        
      } catch (err) {
        console.log(err);
        setError("Error fetching coach details");
      } finally {
        setLoading(false);
      }
    };

    fetchDtails();
    fetchCoachDetails();
  }, [id]);


  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <motion.div
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-500 to-pink-600">
      <motion.div
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-white px-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <NavbarPlay />
      <div className="max-w-4xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white shadow-lg sm:shadow-xl md:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 md:space-y-10">
            {['aboutMe', 'playingExperience', 'teachingExperience', 'teachingMethodology'].map((key, index) => (
              <motion.section 
                key={key} 
                className="space-y-2 sm:space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-800 
                             bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  {key.replace(/([A-Z])/g, ' $1').trim()} 
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-700 
                             px-2 sm:px-4 md:px-6 whitespace-pre-wrap">
                  {profileData?.[key] || "Information not available."}
                </p>
              </motion.section>
            ))}
           
            <motion.div
              className="pt-4 sm:pt-6 md:pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
  {profileData && subscribedcoaches ? (
  <Link
    to={
      subscribedcoaches.includes(user)
        ? "#" // Prevent redirection if already subscribed
        : `/pricingplans?coachId=${id}`
    }
    onClick={(e) => {
      if (subscribedcoaches.includes(profileData._id)) {
        e.preventDefault(); // Prevent default behavior (redirection)
      }
    }}
    className={`block w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white text-lg sm:text-xl font-semibold 
                py-3 sm:py-4 px-4 sm:px-6 rounded-full
                hover:from-indigo-700 hover:to-purple-700 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:ring-opacity-50 transition duration-300 ease-in-out 
                transform hover:scale-105 text-center
                shadow-md hover:shadow-xl ${
                  subscribedcoaches.includes(user)
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
  >
    {subscribedcoaches.includes(user) ? "Subscribed" : "Subscribe Now"}
  </Link>
) : (
  <div>Loading...</div>
)}

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Coachdash;