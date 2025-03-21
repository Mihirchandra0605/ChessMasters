import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SubscriptionChart from './subscription.jsx';
import Viewchart from './views.jsx';
import EarningsChart from './earnings.jsx';
import axios from "axios";

const CoachDashboard = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribedPlayers, setSubscribedPlayers] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // 'article' or 'video'
    itemId: null,
    title: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split("=")[1];
      try {
        // Fetch all articles and videos first
        const [articlesResponse, videosResponse, playersResponse, revenueResponse, profileResponse] = await Promise.all([
          axios.get('http://localhost:3000/admin/articles', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get('http://localhost:3000/admin/videos', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`http://localhost:3000/coach/subscribedPlayers/${coachId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`http://localhost:3000/coach/revenue/${coachId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`http://localhost:3000/coach/details`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          })
        ]);
        
        // Check if profile is completed based on profile data
        const profile = profileResponse.data;
        const isProfileComplete = 
          profile && 
          profile.quote && 
          profile.location && 
          profile.languages && 
          profile.rating && 
          profile.hourlyRate && 
          profile.aboutMe && 
          profile.playingExperience && 
          profile.teachingExperience && 
          profile.teachingMethodology;
        
        setProfileCompleted(isProfileComplete);
        
        console.log('playersResponse', playersResponse);
        
        // Filter articles and videos by coach ID
        const coachArticles = articlesResponse.data.filter(article => article.coach === coachId);
        const coachVideos = videosResponse.data.filter(video => video.coach === coachId);
        
        setArticles(coachArticles || []);
        setVideos(coachVideos || []);
        setSubscribedPlayers(playersResponse.data.subscribers);
        setRevenue(revenueResponse.data.revenue || 0);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coachId]);

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleUpdate = (type, id) => {
    // Use lowercase for the route to match your route definitions
    navigate(`/${type}-update/${id}`);
  };

  const handleDeleteClick = (type, id, title) => {
    // Open confirmation dialog
    setDeleteDialog({
      isOpen: true,
      type,
      itemId: id,
      title
    });
  };

  const confirmDelete = async () => {
    const token = document.cookie.split("=")[1];
    const { type, itemId } = deleteDialog;
    
    try {
      console.log(`Attempting to delete ${type} with ID:`, itemId);
      
      // Make sure endpoint is correct
      const endpoint = type === 'article' 
        ? `http://localhost:3000/coach/article/${itemId}` 
        : `http://localhost:3000/coach/video/${itemId}`;
      
      const response = await axios.delete(
        endpoint,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      console.log(`${type} deletion response:`, response.data);
      
      // Update the state to remove the deleted item
      if (type === 'article') {
        setArticles(articles.filter(article => article._id !== itemId));
      } else {
        setVideos(videos.filter(video => video._id !== itemId));
      }

      // Close the dialog
      setDeleteDialog({ isOpen: false, type: null, itemId: null, title: '' });
      
    } catch (error) {
      console.error(`Error deleting ${type}:`, error.response?.data || error);
      alert(`Failed to delete ${type}: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const cancelDelete = () => {
    // Just close the dialog
    setDeleteDialog({ isOpen: false, type: null, itemId: null, title: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-blue-800">
      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-blue-200 animate-fadeIn">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "<span className="font-semibold">{deleteDialog.title}</span>"?
            </p>
            <p className="text-gray-700 mb-6">
              This content will be permanently removed from your library. This action cannot be undone and will affect your analytics data and content availability to your subscribers.
            </p>
            <div className="flex space-x-4 justify-end">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 shadow-md"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 sm:py-4 px-4 sm:px-6 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <img src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png" 
                 alt="Logo" 
                 className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Coach Dashboard</h1>
          </div>
          <div className="text-white bg-green-500 px-4 py-2 rounded-lg shadow-lg font-semibold text-sm sm:text-base">
            💰 Revenue: ${revenue.toLocaleString()}
          </div>
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden text-white hover:text-blue-200 transition duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </motion.header>

      <div className="flex flex-col md:flex-row">
        {/* Navigation sidebar */}
        <motion.nav
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white 
                      w-full md:w-64 p-6 space-y-4 sm:space-y-5 
                      ${isNavOpen ? 'block' : 'hidden'} md:block flex-shrink-0`}
        >
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <Link to="/Upload" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 
                           hover:from-orange-600 hover:to-red-600 
                           text-white font-bold py-3 px-6 rounded-lg 
                           transition duration-300 ease-in-out shadow-md 
                           hover:shadow-lg text-sm sm:text-base"
              >
                Add
              </motion.button>
            </Link>

            <Link to="/Index" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 
                           hover:from-green-600 hover:to-teal-600 
                           text-white font-bold py-3 px-6 rounded-lg 
                           transition duration-300 ease-in-out shadow-md 
                           hover:shadow-lg text-sm sm:text-base"
              >
                Home
              </motion.button>
            </Link>

            <Link to="/AddData" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
                           hover:from-purple-600 hover:to-pink-600 
                           text-white font-bold py-3 px-6 rounded-lg 
                           transition duration-300 ease-in-out shadow-md 
                           hover:shadow-lg text-sm sm:text-base"
              >
                Complete Profile
              </motion.button>
            </Link>

            {/* Show Update Profile button only if profile is completed */}
            {profileCompleted && (
              <Link to="/update-profile" className="block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 
                             hover:from-amber-600 hover:to-yellow-600 
                             text-white font-bold py-3 px-6 rounded-lg 
                             transition duration-300 ease-in-out shadow-md 
                             hover:shadow-lg text-sm sm:text-base"
                >
                  Update Profile
                </motion.button>
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAnalytics}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
                         hover:from-blue-600 hover:to-indigo-600 
                         text-white font-bold py-3 px-6 rounded-lg 
                         transition duration-300 ease-in-out shadow-md 
                         hover:shadow-lg text-sm sm:text-base"
            >
              Analytics
            </motion.button>
          </div>
        </motion.nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Analytics section */}
          {showAnalytics && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg shadow-xl p-4"
                >
                  <SubscriptionChart />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg shadow-xl p-4"
                >
                  <Viewchart />
                </motion.div>
              </div>
            </>
          )}

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Subscribed Students section */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-xl"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b-2 border-orange-500 pb-2 text-orange-700">
                Subscribed Students
              </h2>
              {loading ? (
                <p>Loading...</p>
              ) : subscribedPlayers.length > 0 ? (
                <ul className="space-y-2">
                  {subscribedPlayers.map((player) => (
                    <li key={player._id} 
                        className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      {player.user.UserName} (Rating: {player.user.elo || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No subscribed students available</p>
              )}
            </motion.section>

            {/* My Videos section */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-xl"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2 text-blue-700">
                My Videos
              </h2>
              <ul className="space-y-3">
                {loading ? (
                  <p>Loading...</p>
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <li key={video._id} 
                        className="hover:bg-gray-50 p-3 rounded-lg transition duration-300 ease-in-out border border-gray-200 shadow-sm">
                      <div className="flex flex-col space-y-2">
                        <Link to={`/Videodetail/${video._id}`} 
                              className="text-blue-600 hover:text-blue-800 font-medium">
                          {video.title}
                        </Link>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdate('video', video._id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-md hover:from-teal-500 hover:to-teal-600 transition duration-300 shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick('video', video._id, video.title)}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md hover:from-red-500 hover:to-red-600 transition duration-300 shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No videos available</li>
                )}
              </ul>
            </motion.section>

            {/* My Articles section */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-xl"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b-2 border-purple-500 pb-2 text-purple-700">
                My Articles
              </h2>
              <ul className="space-y-3">
                {loading ? (
                  <p>Loading...</p>
                ) : articles.length > 0 ? (
                  articles.map((article) => (
                    <li key={article._id} 
                        className="hover:bg-gray-50 p-3 rounded-lg transition duration-300 ease-in-out border border-gray-200 shadow-sm">
                      <div className="flex flex-col space-y-2">
                        <Link to={`/Articledetail/${article._id}`} 
                              className="text-blue-600 hover:text-blue-800 font-medium">
                          {article.title}
                        </Link>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdate('article', article._id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-md hover:from-indigo-500 hover:to-indigo-600 transition duration-300 shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick('article', article._id, article.title)}
                            className="px-3 py-1.5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-md hover:from-rose-500 hover:to-rose-600 transition duration-300 shadow-sm flex items-center text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No articles available</li>
                )}
              </ul>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;
