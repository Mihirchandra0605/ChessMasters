import React, { useEffect, useState } from "react";
import styles from "../styles/Coachprofile.module.css";

const Coachprofile = () => {
  const [coachData, setCoachData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from a database
    const fetchData = () => {
      const data = [
        {
          image: "https://picsum.photos/seed/picsum/200/300", // Replace with actual path to the image
          name: "John Doe",
          quote: "Chess is the art of war on a board.",
          location: "New York, USA",
          languages: ["English", "Spanish"],
          rating: 2500,
          hourlyRate: 50,
        },
      ];
      setCoachData(data);
    };
    fetchData();
  }, []);

  if (!coachData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.coachProfiles}`}>
      {coachData.map((coach, index) => (
        <button key={index} className={`${styles.coachProfile}`}>
          <div className={`${styles.coachImage}`}>
            <img src={coach.image} alt={`${coach.name}'s profile`} />
          </div>
          <div className={`${styles.coachContent}`}>
            <h1>{coach.name}</h1>
            <p className="coach-quote">"{coach.quote}"</p>
            <p className="coach-location">Location: {coach.location}</p>
            <p className="coach-languages">
              Languages: {coach.languages.join(", ")}
            </p>
            <p className="coach-rating">Rating: {coach.rating}</p>
            <p className="coach-rate">Hourly Rate: ${coach.hourlyRate}</p>
          </div>
        </button>
      ))}
      {/* <button className="add-profile-button" onClick={() => {
    // Your logic to add more profiles goes here
    console.log('Add profile button clicked');
}}>
    +
</button> */}
    </div>
  );
};

export default Coachprofile;
