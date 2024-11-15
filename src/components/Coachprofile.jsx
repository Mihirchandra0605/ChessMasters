import React, { useEffect, useState } from "react";
import styles from "../styles/Coachprofile.module.css";
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
        const response = await axios.get('http://localhost:3000/coach/coaches', {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.coachProfiles}>
      {coachData.map((coach) => (
        <button
          key={coach._id}
          className={styles.coachProfile}
          onClick={() => handleProfileClick(coach._id)}
        >
          <div className={styles.coachImage}>
            <img
              src={coach.image || "https://picsum.photos/seed/picsum/200/300"}
              alt={`${coach.user.UserName}'s profile`}
            />
          </div>
          <div className={styles.coachContent}>
            <h1>{coach.user.UserName}</h1>
            <p className="coach-quote">{coach.quote}</p>
            <p className="coach-location">Location: {coach.location}</p>
            <p className="coach-languages">
              Languages: {coach.languages?.join(", ") || "N/A"}
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
