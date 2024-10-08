import React, { useEffect, useState } from "react";
import styles from "../styles/Coachprofile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Coachprofile = () => {
  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = document.cookie.split("=")[1];

        // Make the API call to fetch the list of coaches
        const response = await axios.get('http://localhost:5000/coach/coaches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCoachData(response.data); // Save coach data
        setLoading(false);
      } catch (error) {
        setError('Error fetching coach data');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleProfileClick = (id) => {
    console.log("Navigating to coach with ID:", id); // For debugging
    navigate(`/CoachInfo/${id}`);
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`${styles.coachProfiles}`}>
      {coachData.map((coach, index) => (
        <button
          key={index}
          className={`${styles.coachProfile}`}
          onClick={() => handleProfileClick(coach._id)} // Navigate when clicked
        >
          <div className={`${styles.coachImage}`}>
            <img
              src={coach.image || "https://picsum.photos/seed/picsum/200/300"} 
              alt={`${coach.UserName}'s profile`}
            />
          </div>
          <div className={`${styles.coachContent}`}>
            <h1>{coach.UserName}</h1>
            <p className="coach-quote">{coach.quote}</p>
            <p className="coach-location">Location: {coach.location}</p>
            <p className="coach-languages">
              Languages: {coach.languages ? coach.languages.join(", ") : "N/A"}
            </p>
            <p className="coach-rating">Rating: {coach.rating || "N/A"}</p>
            <p className="coach-rate">Hourly Rate: ${coach.hourlyRate || "N/A"}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Coachprofile;
