import { useState, useEffect, useRef } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '********'
  });
  const [eloData, setEloData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedCoaches, setSubscribedCoaches] = useState([]);
  const [unsubscribing, setUnsubscribing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPlayerDetails = async () => {
      const token = document.cookie.split("=")[1];
      try {
        const response = await axios.get('http://localhost:3000/auth/details', {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isMounted) {
          const player = response.data;
          setFormData({
            name: player.UserName,
            email: player.Email,
            password: '********'
          });
          setEloData(player.eloHistory || []);
          setLoading(false);

          const coachesResponse = await axios.get(
            `http://localhost:3000/player/${id}/subscribedCoaches`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          console.log(coachesResponse.data)
          if (isMounted) setSubscribedCoaches(coachesResponse.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching player details:', error);
          setLoading(false);
        }
      }
    };

    fetchPlayerDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUnsubscribe = async (coachId) => {
    if (unsubscribing) return;
    
    setUnsubscribing(true);
    const token = document.cookie.split("=")[1];
    
    try {
      await axios.post(
        'http://localhost:3000/player/unsubscribe',
        { coachId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      // Remove the coach from the local state
      setSubscribedCoaches(prev => prev.filter(coach => coach._id !== coachId));
      
    } catch (error) {
      console.error('Error unsubscribing from coach:', error);
      // Show error notification
      alert('Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribing(false);
    }
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const coachScrollContainerRef = useRef(null);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"> Loading... </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-blue-900 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-4 sm:mb-0">Profile</h1>
            <Link to="/Index?role=player" className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
              Home
            </Link>
          </div>

          {/* Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img 
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1820405/profile/profile-512.jpg" 
                  alt={formData.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-4 border-emerald-500/30 shadow-lg"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-200">{formData.name}</h2>
                  <p className="text-base sm:text-lg text-emerald-400">Player</p>
                </div>
              </div>

              {/* Form Fields */}
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300 capitalize">
                    {field}
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isEditing[field] ? (
                      <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full sm:w-auto flex-grow mt-1 rounded-md border-slate-600 bg-slate-800/50 text-slate-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 px-3 py-2"
                      />
                    ) : (
                      <span className="text-base sm:text-lg text-slate-300">{formData[field]}</span>
                    )}
                    <button
                      onClick={() => handleEdit(field)}
                      className="px-4 py-2 bg-slate-700 text-emerald-400 rounded-lg hover:bg-slate-600 transition duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      {isEditing[field] ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ELO Chart Section */}
            <div className="h-64 sm:h-80 md:h-auto bg-slate-800/50 rounded-xl shadow-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eloData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="gameNumber" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#475569', 
                      color: '#f8fafc' 
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="linear" // Ensures a straight line between points
                    dataKey="elo" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ fill: '#34d399', strokeWidth: 2 }} 
                    connectNulls={true} // Ensures null or missing values are connected
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Coaches Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-200 mb-6">
              Subscribed Coaches
            </h2>
            <div className="relative">
              <div 
                ref={coachScrollContainerRef} 
                className="flex space-x-4 sm:space-x-6 overflow-x-auto py-4 sm:py-6 px-8 sm:px-10
                  scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/40
                  hover:scrollbar-thumb-slate-500"
              >
                {subscribedCoaches.length > 0 ? subscribedCoaches.map((coach) => (
                  <div 
                    key={coach._id} 
                    className="flex-shrink-0 w-48 sm:w-56 bg-slate-800/50 rounded-xl shadow-lg 
                      p-4 sm:p-6 space-y-3 sm:space-y-4 transform transition duration-300 
                      hover:scale-105 hover:bg-slate-700/50"
                  >
                    <h3 className="text-base sm:text-xl font-semibold text-center text-slate-200">
                      {coach.UserName}
                    </h3>
                    <p className="text-blue-400 text-center ">
                      {coach.Email}
                    </p>
                    {coach.rating && (
                      <p className="text-emerald-400 text-center">Rating: {coach.rating}</p>
                    )}
                    {coach.location && (
                      <p className="text-slate-300 text-center text-sm">{coach.location}</p>
                    )}
                    <button 
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 
                        transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                      onClick={() => handleUnsubscribe(coach._id)}
                      disabled={unsubscribing}
                    >
                      {unsubscribing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Unsubscribing...
                        </span>
                      ) : "Unsubscribe"}
                    </button>
                  </div>
                )) : (
                  <p className="text-slate-300">No subscribed coaches found.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
        