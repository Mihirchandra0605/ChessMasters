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

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split("=")[1];
      try {
        const [articlesResponse, videosResponse, playersResponse] = await Promise.all([
          fetch('http://localhost:3000/admin/articles', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('http://localhost:3000/admin/videos', {
            method: 'GET',
            credentials: 'include',
          }),
          axios.get(`http://localhost:3000/coach/subscribedPlayers/${coachId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          })
        ]);

        const articlesData = await articlesResponse.json();
        const videosData = await videosResponse.json();

        setArticles(articlesData || []);
        setVideos(videosData || []);
        setSubscribedPlayers(playersResponse.data.subscribers);
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
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6 shadow-lg flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <img src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png" alt="Logo" className="h-10 w-10 rounded-full " />
          <h1 className="text-2xl font-bold text-white">Coach Dashboard</h1>
        </div>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-white hover:text-blue-200 transition duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </motion.header>
      <div className="flex flex-col md:flex-row">
        <motion.nav
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white w-full md:w-48 p-4 ${isNavOpen ? 'block' : 'hidden'} md:block`}
        >
          <Link to="/Upload" className="block mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Add
            </motion.button>
          </Link>
          <Link to="/Index" className="block mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Home
            </motion.button>
          </Link>
          <Link to="/AddData" className="block mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Complete Profile
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAnalytics}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Analytics
          </motion.button>
        </motion.nav>
        <main className="flex-1 p-6">
          {showAnalytics && (
            <>
              <div className="sub-analysis h-[45rem] grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-[400px] flex flex-col"
                >
                  <div className="flex-grow flex items-center justify-center">
                    <SubscriptionChart />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="h-[400px] flex flex-col"
                >
                  <div className="flex-grow flex items-center justify-center">
                    <Viewchart />
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="earning h-[53rem] flex flex-col mb-6"
              >
                <div className="flex-grow flex items-center justify-center">
                  <EarningsChart />
                </div>
              </motion.div>
            </>
          )}
          <div className="coachDashboard grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-orange-500 pb-2 text-orange-700">Subscribed Students</h2>
              {loading ? (
                <p>Loading...</p>
              ) : subscribedPlayers.length > 0 ? (
                <ul className="space-y-2">
                  {subscribedPlayers.map((player) => (
                    <li key={player._id} className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      {player.UserName} (Rating: {player.rating || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No subscribed students available</p>
              )}
            </motion.section>
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2 text-blue-700">Videos</h2>
              <ul className="space-y-2">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <li key={video._id} className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      <Link to={`/Videodetail/${video._id}`} className="text-blue-600 hover:text-blue-800">{video.title}</Link>
                    </li>
                  ))
                ) : (
                  <li>No videos available</li>
                )}
              </ul>
            </motion.section>
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 border-b-2 border-purple-500 pb-2 text-purple-700">Articles</h2>
              <ul className="space-y-2">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <li key={article._id} className="hover:bg-gray-100 p-2 rounded transition duration-300 ease-in-out">
                      <Link to={`/Articledetail/${article._id}`} className="text-blue-600 hover:text-blue-800">{article.title}</Link>
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