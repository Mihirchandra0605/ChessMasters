import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  if (loading) return <div className="flex justify-center items-center h-screen text-3xl font-semibold text-purple-600">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-3xl font-semibold text-red-600">{error}</div>;

  return (
    <div className="bg-gradient-to-br from-yellow-300  to-black min-h-screen p-8">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {coachData.map((coach, index) => {
          const user = coach.user || {};

          return (
            <motion.button
              key={coach._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:-translate-y-1 hover:shadow-2xl"
              onClick={() => handleProfileClick(coach._id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative h-56 w-full">
                <img
                  src={coach.image || "https://picsum.photos/seed/picsum/200/300"}
                  alt={`${user.UserName || "Unknown Coach"}'s profile`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white">{user.UserName || "Unknown Coach"}</h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-gray-600 italic text-lg">"{coach.quote || "No quote available"}"</p>
                <p className="text-gray-700"><span className="font-semibold">Location:</span> {coach.location || "N/A"}</p>
                <p className="text-gray-700"><span className="font-semibold">Languages:</span> {coach.languages?.join(", ") || "N/A"}</p>
                <p className="text-gray-700"><span className="font-semibold">Rating:</span> {coach.rating || "N/A"}</p>
                <p className="text-purple-600 font-bold text-xl"><span className="font-semibold">Hourly Rate:</span> ${coach.hourlyRate || "N/A"}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Coachprofile;