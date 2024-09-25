import React, { useState, useRef } from 'react';
import "../styles/profile.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {Link} from 'react-router-dom';

const sampleData = [
  { name: 'Game 1', elo: 400 },
  { name: 'Game 2', elo: 820 },
  { name: 'Game 3', elo: 790 },
  { name: 'Game 4', elo: 1000 },
  { name: 'Game 5', elo: 1250 }
];

// Sample data for subscribed coaches
const subscribedCoaches = [
  { id: 1, name: 'Coach A', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' },
  { id: 2, name: 'Coach B', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' },
  { id: 3, name: 'Coach C', imageUrl: 'https://www.pngplay.com/wp-content/uploads/1/Female-Scientist-Transparent-Images.png' }
];

function Profile() {
  const [isEditing, setIsEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({
    name: 'Albert Feynman',
    email: 'albert@example.com',
    password: '********'
  });
  const [coaches, setCoaches] = useState(subscribedCoaches);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Scroll Ref for carousel
  const scrollLeftRef = useRef(null);
  const scrollRightRef = useRef(null);
  const coachScrollContainerRef = useRef(null);

  // Unsubscribe handler
  const handleUnsubscribe = (id) => {
    setCoaches(coaches.filter(coach => coach.id !== id));
  };

  return (
    <div className="profile-page">
      <div className="header">
        <h1>Profile</h1>
        <Link to="/Index"><button className="home-btn">Home</button></Link>
      </div>

      <div className="container">
        <div className="profile-section">
          <div className="avatar-holder">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg"
              alt="Albert Feynman"
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

      {/* Subscribed Coaches Carousel */}
      <div className="section_content" id="carousel">
        <h2 className="heading">Subscribed Coaches:</h2>
        <div id="coach_box">
          <img
            src="/public/back.png"
            alt="Scroll Left"
            id="scrollLeft"
            ref={scrollLeftRef}
          />

          <div
            className="coach_scroll_container"
            ref={coachScrollContainerRef}
          >
            {coaches.map((coach) => (
              <div key={coach.id} className="coach">
                <img src={coach.imageUrl} alt={coach.name} />
                <span className="coach_name">{coach.name}</span>
                <button className="unsubscribe-btn" onClick={() => handleUnsubscribe(coach.id)}>
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>

          <img
            src="/public/next.png"
            alt="Scroll Right"
            id="scrollRight"
            ref={scrollRightRef}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;