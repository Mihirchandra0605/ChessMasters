import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const sampleData = [
  { name: 'Game 1', elo: 400 },
  { name: 'Game 2', elo: 820 },
  { name: 'Game 3', elo: 790 },
  { name: 'Game 4', elo: 1000 },
  { name: 'Game 5', elo: 1250 }
];

const Profile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState({ name: false, email: false, password: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [loading, setLoading] = useState(true);
  const [subscribedCoaches, setSubscribedCoaches] = useState([]);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const token = document.cookie.split("=")[1];
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

        const coachesResponse = await axios.get(`http://localhost:3000/player/${id}/subscribedCoaches`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setSubscribedCoaches(coachesResponse.data);
        
      } catch (error) {
        console.error('Error fetching player details:', error);
        setLoading(false);
      }
    };
    fetchPlayerDetails();
  }, [id]);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const coachScrollContainerRef = useRef(null);

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
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Profile</h1>
          <Link to="/Index?role=player">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Home
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg"
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="flex items-center">
                    {isEditing[field] ? (
                      <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      <span className="text-gray-700">{formData[field]}</span>
                    )}
                    <button
                      onClick={() => handleEdit(field)}
                      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      {isEditing[field] ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ELO Progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="elo" stroke="#4299E1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscribed Coaches</h2>
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={coachScrollContainerRef}
              className="flex overflow-x-auto space-x-4 py-4 px-8 scrollbar-hide"
            >
              {subscribedCoaches.length > 0 ? (
  subscribedCoaches.map((coach) => (
    <div key={coach._id} className="flex-none w-48">
      <div className="bg-gray-100 rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105">
        <img src={coach.imageUrl || "/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"} alt={coach.user.UserName} className="w-full h-32 object-cover rounded-md mb-2" />
        <h3 className="font-semibold text-gray-800 mb-2 text-center">{coach.user.UserName}</h3>
        <p className="text-gray-600 text-center">{coach.user.Email}</p>
        <p className="text-gray-600 text-center">Rating: {coach.rating}</p>
        <button
          onClick={() => console.log(`Unsubscribing from ${coach.user.UserName}`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-600">No subscribed coaches</p>
)}

            </div>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;