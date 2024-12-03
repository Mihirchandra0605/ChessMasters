import React, { useState, useEffect, useRef } from 'react';
// import "../styles/profile.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // For API requests


const sampleData = [
  { name: 'Game 1', elo: 400 },
  { name: 'Game 2', elo: 820 },
  { name: 'Game 3', elo: 790 },
  { name: 'Game 4', elo: 1000 },
  { name: 'Game 5', elo: 1250 }
];

const CProfile = () => {
  const { coachId } = useParams();
  const [isEditing, setIsEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [loading, setLoading] = useState(true); // For loading state
  const [subscribedPlayers, setSubscribedPlayers] = useState([]);

  // Fetch player details on component mount
  useEffect(() => {
    const fetchCoachDetails = async () => {
      const token = document.cookie.split("=")[1]
      try {
        const response = await axios.get('http://localhost:3000/auth/details', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`// using tokens for authentication
          }
        });
        const player = response.data;
        console.log('player:', player)
        setFormData({
          name: player.UserName,
          email: player.Email,
          // level: Coach.CoachLevel,
          password: '********' // isme changes required
        });
        setLoading(false);

        console.log("Coach ID:", coachId);

        const playersResponse = await axios.get(`http://localhost:3000/coach/subscribedPlayers/${coachId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        console.log(playersResponse);
        setSubscribedPlayers(playersResponse.data.subscribers);
        console.log(subscribedPlayers);
        // const data = await playersResponse.json();

      } catch (error) {
        console.error('Error fetching player details:', error);
        setLoading(false);
      }
    };

    fetchCoachDetails();
  }, [coachId]);

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
    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-yellow-50 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-teal-800">Profile</h1>
            <Link to="/Index?role=coach" className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">Home</Link>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg" alt={formData.name} className="w-32 h-32 rounded-full border-4 border-teal-400 shadow-lg" />
                <div>
                  <h2 className="text-3xl font-semibold text-teal-800">{formData.name}</h2>
                  <p className="text-teal-600 text-lg">Coach</p>
                </div>
              </div>
  
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-teal-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <div className="flex items-center space-x-3">
                    {isEditing[field] ? (
                      <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-teal-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 bg-teal-50"
                      />
                    ) : (
                      <span className="text-teal-800 text-lg">{formData[field]}</span>
                    )}
                    <button
                      onClick={() => handleEdit(field)}
                      className="px-4 py-2 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      {isEditing[field] ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
  
            <div className="h-80 md:h-auto bg-lime-200 rounded-2xl shadow-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2f1" />
                  <XAxis dataKey="name" stroke="#00897b" />
                  <YAxis stroke="#00897b" />
                  <Tooltip contentStyle={{ backgroundColor: '#e0f2f1', borderColor: '#4db6ac' }} />
                  <Legend />
                  <Line type="monotone" dataKey="elo" stroke="#00897b" strokeWidth={2} dot={{ fill: '#4db6ac', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-teal-800 mb-6">Subscribed Players</h2>
            <div className="relative">
              <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full shadow-md z-10 hover:bg-teal-600 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div ref={coachScrollContainerRef} className="flex space-x-6 overflow-x-auto py-6 px-10 scrollbar-hide">
                {subscribedPlayers.map((player) => (
                  <div key={player._id} className="flex-shrink-0 w-56 bg-blue-100 rounded-2xl shadow-lg p-6 space-y-4 transform transition duration-300 hover:scale-105">
                    <img src={player.imageUrl || "/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"} alt={player.UserName} className="w-full h-40 object-cover rounded-xl" />
                    <h3 className="text-xl font-semibold text-teal-800">{player.UserName}</h3>
                    <button className="w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      Unsubscribe
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full shadow-md z-10 hover:bg-teal-600 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CProfile;
