import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaLanguage, FaDollarSign } from "react-icons/fa";
import { mihirBackend } from "../../config.js";

const Coachprofile = () => {
  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = document.cookie.split("=")[1];
        const response = await axios.get(`http://${mihirBackend}/coach/coaches`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setCoachData(response.data);
        // If response is successful but no coaches are found
        if (response.data.length === 0) {
          setError("No coaches available at the moment");
        }
      } catch (error) {
        console.error("Error fetching coach data:", error);
        
        // Check if it's a 404 error (no coaches endpoint or no coaches found)
        if (error.response && error.response.status === 404) {
          setError("No coaches available at the moment");
        } else {
          setError("Unable to load coach profiles. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleProfileClick = (id) => {
    navigate(`/Coachdash/${id}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <motion.div
        className="text-2xl sm:text-4xl md:text-6xl font-bold text-[#2D4356] px-4 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-indigo-500">
      <motion.div
        className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">
          {error === "No coaches available at the moment" ? "No Coaches Found" : "Something Went Wrong"}
        </h2>
        <p className="text-lg text-gray-700 text-center">
          {error === "No coaches available at the moment" 
            ? "There are currently no coaches available in our system. Please check back later as we continue to grow our coaching team."
            : "We're experiencing some difficulties loading the coach profiles. Please try again later."}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 
                   max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {coachData.map((coach, index) => {
          const user = coach.user || {};

          return (
            <motion.div
              key={coach._id}
              className="bg-[#E0F4FF] backdrop-filter backdrop-blur-lg 
                         rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden 
                         transition-all duration-300 hover:scale-105 
                         focus:outline-none focus:ring-2 focus:ring-[#569DAA] 
                         focus:ring-opacity-50 transform hover:-translate-y-2 
                         hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.button
                className="w-full h-full text-left focus:outline-none"
                onClick={() => handleProfileClick(coach._id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full">
                  <img
                    src={coach.image || "https://picsum.photos/seed/picsum/200/300"}
                    alt={`${user.UserName || "Unknown Coach"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D4356] via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#E0F4FF] mb-2 sm:mb-4">
                      {user.UserName || "Unknown Coach"}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#B9E9FC] italic">
                      "{coach.quote || "No quote available"}"
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="flex items-center text-[#2D4356] text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    <FaMapMarkerAlt className="mr-4 text-2xl sm:text-3xl md:text-4xl" />
                    <span>{coach.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-[#2D4356] text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    <FaLanguage className="mr-4 text-2xl sm:text-3xl md:text-4xl" />
                    <span>{coach.languages?.join(", ") || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-[#2D4356] text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    <FaStar className="mr-4 text-2xl sm:text-3xl md:text-4xl text-yellow-500" />
                    <span>{coach.rating || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-[#2D4356] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                    <FaDollarSign className="mr-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
                    <span>${coach.hourlyRate || "N/A"}/hr</span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Coachprofile;
