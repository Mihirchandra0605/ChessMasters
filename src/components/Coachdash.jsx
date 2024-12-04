import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarPlay from "./navbarplay";
import axios from "axios";
import { motion } from "framer-motion";

const Coachdash = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/coach/${id}`);
        setProfileData(response.data);
      } catch (err) {
        setError("Error fetching coach details");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachDetails();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <motion.div
        className="text-4xl font-bold text-white"
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
        className="text-3xl font-semibold text-white"
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
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white shadow-2xl rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-10 space-y-10">
          {['aboutMe', 'playingExperience', 'teachingExperience', 'teachingMethodology'].map((key, index) => (
              <motion.section 
                key={key} 
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h2 className="text-3xl font-bold text-indigo-800">
                  {key.replace(/([A-Z])/g, ' $1').trim()} 
                </h2>
                <p className="text-xl text-gray-700">
                  {profileData?.[key] || "Information not available."}
                </p>
              </motion.section>
            ))}
           
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to={`/pricingplans?coachId=${id}`} 
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold py-4 px-6 rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 text-center">
                Subscribe Now
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Coachdash;