import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // To access the coach ID from the URL
import NavbarPlay from './navbarplay.jsx';
import styles from '../styles/Coachdash.module.css';
import axios from 'axios';

const Coachdash = () => {
  const { id } = useParams();  // Get coach ID from URL params
  console.log(id);  // Add this after const { id } = useParams();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Coach ID:", id); 
    const fetchCoachData = async () => {
        if (!id) {
            setError('Coach ID is missing');
            setLoading(false);
            return;
          }
      try {
        const token = document.cookie.split("=")[1];  // Assume token stored in cookie

        // Fetch the specific coach's detailed data
        const response = await axios.get(`http://localhost:5000/coach/coaches/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfileData(response.data);  // Set the coach profile data
        setLoading(false);
      } catch (err) {
        setError('Error fetching coach profile');
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="coachdash">
      <NavbarPlay />
      <div className={`${styles.profileSection}`}>
        <div className={`${styles.aboutme}`}>
          <h1>About Me</h1>
          <p>{profileData.aboutMe || "N/A"}</p>
        </div>
        <div className={`${styles.playex}`}>
          <h1>Playing Experience</h1>
          <ul>
            {profileData.playingExperience?.map((item, index) => (
              <li key={index} className={styles.noBullet}>{item}</li>
            )) || <li>N/A</li>}
          </ul>
        </div>
        <div className={`${styles.teachex}`}>
          <h1>Teaching Experience</h1>
          <ul>
            {profileData.teachingExperience?.map((item, index) => (
              <li key={index} className={styles.noBullet}>{item}</li>
            )) || <li>N/A</li>}
          </ul>
        </div>
        <div className={`${styles.teachmethod}`}>
          <h1>Teaching Methodology</h1>
          <p>{profileData.teachingMethodology || "N/A"}</p>
        </div>
        <button className={`${styles.subscribe}`}>Subscribe</button>
      </div>
    </div>
  );
}

export default Coachdash;
