import React, { useEffect, useState } from "react";
import styles from "../styles/Coachprofile.module.css";
import axios from "axios";

const Coachprofile = () => {
  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
       
        const token = document.cookie.split("=")[1]

        // Make the API call to fetch the list of coaches
        const response = await axios.get('http://localhost:5000/Coach/coaches', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });

        setCoachData(response.data); 
        setLoading(false);
      } catch (error) {
        setError('Error fetching coach data');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`${styles.coachProfiles}`}>
      {coachData.map((coach, index) => (
        <button key={index} className={`${styles.coachProfile}`}>
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
