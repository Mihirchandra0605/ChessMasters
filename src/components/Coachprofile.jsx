import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt, FaLanguage, FaDollarSign } from "react-icons/fa";

const Coachprofile = () => {
  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = document.cookie.split("=")[1];
        const response = await axios.get("http://localhost:3000/coach/coaches", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });

        setCoachData(response.data);
      } catch (error) {
        console.error("Error fetching coach data:", error);
        setError("Error fetching coach data");
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
        className="text-6xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-400 to-pink-500">
      <motion.div
        className="text-5xl font-semibold text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-black-400 to-blue-600 min-h-screen p-12">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {coachData.map((coach, index) => {
          const user = coach.user || {};

          return (
            <motion.div
              key={coach._id}
              className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:-translate-y-2 hover:shadow-2xl"
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
                <div className="relative h-80 w-full">
                  <img
                    src={coach.image || "https://picsum.photos/seed/picsum/200/300"}
                    alt={`${user.UserName || "Unknown Coach"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <h2 className="text-6xl font-bold text-white mb-4">{user.UserName || "Unknown Coach"}</h2>
                    <p className="text-gray-200 text-2xl italic">"{coach.quote || "No quote available"}"</p>
                  </div>
                </div>
                <div className="p-10 space-y-8">
                  <div className="flex items-center text-gray-100 text-3xl">
                    <FaMapMarkerAlt className="mr-4 text-4xl" />
                    <span>{coach.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-100 text-3xl">
                    <FaLanguage className="mr-4 text-4xl" />
                    <span>{coach.languages?.join(", ") || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-yellow-300 text-3xl">
                    <FaStar className="mr-4 text-4xl" />
                    <span>{coach.rating || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-green-300 font-bold text-4xl">
                    <FaDollarSign className="mr-4 text-5xl" />
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