import React, { useState, useEffect, useRef } from 'react';
import "../styles/profile.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import axios from 'axios'; // For API requests


const sampleData = [
  { name: 'Game 1', elo: 400 },
  { name: 'Game 2', elo: 820 },
  { name: 'Game 3', elo: 790 },
  { name: 'Game 4', elo: 1000 },
  { name: 'Game 5', elo: 1250 }
];

// Static subscribed coaches data
const subscribedCoaches = [
  { id: 1, name: 'Coach A', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' },
  { id: 2, name: 'Coach B', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' },
  { id: 3, name: 'Coach C', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' }
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [loading, setLoading] = useState(true); // For loading state

  // Fetch player details on component mount
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const token = document.cookie.split("=")[1];
      console.log("Token:", token); // Check if this is a valid token
      try {
        const response = await axios.get('http://localhost:3000/auth/details', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const player = response.data;
        setFormData({
          name: player.UserName,
          email: player.Email,
          password: '********'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching player details:', error);
        setLoading(false);
      }
    };
    fetchPlayerDetails();
  }, []);
  
  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Scroll Refs
  const scrollLeftRef = useRef(null);
  const scrollRightRef = useRef(null);
  const coachScrollContainerRef = useRef(null);

  // Scroll Handlers
  const scrollLeft = () => {
    if (coachScrollContainerRef.current) {
      coachScrollContainerRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (coachScrollContainerRef.current) {
      coachScrollContainerRef.current.scrollLeft += 100;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      {/* Profile content */}
      <div className="header">
        <h1>Profile</h1>
        <Link to="/Index?role=player"><button className="home-btn">Home</button></Link>
      </div>

      <div className="container">
        <div className="profile-section">
          <div className="avatar-holder">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg"
              alt={formData.name}
            />
          </div>
          <div className="info">
            <div className="field">
              <label>Name</label>
              {isEditing.name ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.name}</span>
              )}
              <button onClick={() => handleEdit('name')}>
                {isEditing.name ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="field">
              <label>Email</label>
              {isEditing.email ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.email}</span>
              )}
              <button onClick={() => handleEdit('email')}>
                {isEditing.email ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="field">
              <label>Password</label>
              {isEditing.password ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.password}</span>
              )}
              <button onClick={() => handleEdit('password')}>
                {isEditing.password ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="chart-section">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="elo" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscribed Coaches Carousel - Static */}
      <div className="section_content" id="carousel">
        <h2 className="heading">Subscribed Coaches:</h2>
        <div id="coach_box">
          <img
            src="/public/back.png"
            alt="Scroll Left"
            id="scrollLeft"
            onClick={scrollLeft} // Trigger scroll left
            ref={scrollLeftRef}
          />

          <div className="coach_scroll_container" ref={coachScrollContainerRef}>
            {subscribedCoaches.map((coach) => (
              <div key={coach.id} className="coach">
                <img src={coach.imageUrl} alt={coach.name} />
                <span className="coach_name">{coach.name}</span>
                <button className="unsubscribe-btn" onClick={() => console.log(`Unsubscribing from ${coach.name}`)}>
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>

          <img
            src="/public/next.png"
            alt="Scroll Right"
            id="scrollRight"
            onClick={scrollRight} // Trigger scroll right
            ref={scrollRightRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
