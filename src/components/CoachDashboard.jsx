import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SubscriptionChart from './subscription.jsx';
import Viewchart from './views.jsx';
import EarningsChart from './earnings.jsx';
import axios from "axios";

const CoachDashboard = () => {
  const { coachId } = useParams();
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribedPlayers, setSubscribedPlayers] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split("=")[1];
      try {
        // Fetch all articles and videos first
        const [articlesResponse, videosResponse, playersResponse, revenueResponse] = await Promise.all([
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
          })
        ]);
        
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-blue-800">
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
              <ul className="space-y-2">
                {loading ? (
                  <p>Loading...</p>
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <li key={video._id} 
                        className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      <Link to={`/Videodetail/${video._id}`} 
                            className="text-blue-600 hover:text-blue-800">
                        {video.title}
                      </Link>
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
              <ul className="space-y-2">
                {loading ? (
                  <p>Loading...</p>
                ) : articles.length > 0 ? (
                  articles.map((article) => (
                    <li key={article._id} 
                        className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      <Link to={`/Articledetail/${article._id}`} 
                            className="text-blue-600 hover:text-blue-800">
                        {article.title}
                      </Link>
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
