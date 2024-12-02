import React, { useEffect, useState } from "react";
// import styles from "../styles/Coachprofile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">Loading...</div>;
if (error) return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-red-600">{error}</div>;

return (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Coach Profiles</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {coachData.map((coach) => {
        const user = coach.user || {}; // Safeguard against null or undefined `user`

        return (
          <button
            key={coach._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={() => handleProfileClick(coach._id)}
          >
            <div className="relative h-48 w-full">
              <img
                src={coach.image || "https://picsum.photos/seed/picsum/200/300"}
                alt={`${user.UserName || "Unknown Coach"}'s profile`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{user.UserName || "Unknown Coach"}</h2>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <p className="text-gray-600 italic">"{coach.quote || "No quote available"}"</p>
              <p className="text-gray-700"><span className="font-semibold">Location:</span> {coach.location || "N/A"}</p>
              <p className="text-gray-700"><span className="font-semibold">Languages:</span> {coach.languages?.join(", ") || "N/A"}</p>
              <p className="text-gray-700"><span className="font-semibold">Rating:</span> {coach.rating || "N/A"}</p>
              <p className="text-gray-700"><span className="font-semibold">Hourly Rate:</span> ${coach.hourlyRate || "N/A"}</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
}

export default Coachprofile;
