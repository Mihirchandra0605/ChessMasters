import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarPlay from "./navbarplay";
import styles from "../styles/Coachdash.module.css";
import axios from "axios";

const Coachdash = () => {
  const { id } = useParams(); // Get the coach ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false); // New state to track subscription
  const [message, setMessage] = useState(""); // State for feedback messages

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

  const handleSubscribe = async () => {
    try {
      const token = document.cookie.split("=")[1]; // Assuming your token is stored in cookies
      const response = await axios.post(
        "http://localhost:3000/player/subscribe",
        { coachId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setSubscribed(true);
      setMessage("Successfully subscribed to the coach!");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error subscribing to the coach"
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="coachdash">
      <NavbarPlay />
      <div className={styles.profileSection}>
        <div className={styles.aboutme}>
          <h1>About Me</h1>
          <p>{profileData?.aboutMe}</p>
        </div>
        <div className={styles.playex}>
          <h1>Playing Experience</h1>
          <p>{profileData?.playingExperience}</p>
        </div>
        <div className={styles.teachex}>
          <h1>Teaching Experience</h1>
          <p>{profileData?.teachingExperience}</p>
        </div>
        <div className={styles.teachmethod}>
          <h1>Teaching Methodology</h1>
          <p>{profileData?.teachingMethodology}</p>
        </div>
        {subscribed ? (
          <p className={styles.successMessage}>{message}</p>
        ) : (
          <button className={styles.subscribe} onClick={handleSubscribe}>
            Subscribe
          </button>
        )}
        {message && !subscribed && (
          <p className={styles.errorMessage}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Coachdash;
