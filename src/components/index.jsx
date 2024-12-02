import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [articles, setArticles] = useState(null);
  const [videos, setVideos] = useState([]);
  const [searchParams] = useSearchParams();
  const [isPlayer, setIsPlayer] = useState(searchParams.get('role') === 'player');

  const gameScrollContainerRef = useRef(null);
  const scrollLeftRef = useRef(null);
  const scrollRightRef = useRef(null);
  const videoScrollContainerRef = useRef(null);
  const videoScrollLeftRef = useRef(null);
  const videoScrollRightRef = useRef(null);
  const articleScrollContainerRef = useRef(null);
  const articleScrollLeftRef = useRef(null);
  const articleScrollRightRef = useRef(null);

  useEffect(() => {
    const setupScroll = (scrollContainer, scrollLeftButton, scrollRightButton) => {
      const scrollLeft = () => {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: -100, behavior: "smooth" });
        }
      };
      const scrollRight = () => {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: 100, behavior: "smooth" });
        }
      };
      if (scrollLeftButton) {
        scrollLeftButton.addEventListener("click", scrollLeft);
      }
      if (scrollRightButton) {
        scrollRightButton.addEventListener("click", scrollRight);
      }
      return () => {
        if (scrollLeftButton) {
          scrollLeftButton.removeEventListener("click", scrollLeft);
        }
        if (scrollRightButton) {
          scrollRightButton.removeEventListener("click", scrollRight);
        }
      };
    };

    const gameCleanup = setupScroll(
      gameScrollContainerRef.current,
      scrollLeftRef.current,
      scrollRightRef.current
    );
    const videoCleanup = setupScroll(
      videoScrollContainerRef.current,
      videoScrollLeftRef.current,
      videoScrollRightRef.current
    );
    const articleCleanup = setupScroll(
      articleScrollContainerRef.current,
      articleScrollLeftRef.current,
      articleScrollRightRef.current
    );

    return () => {
      gameCleanup();
      videoCleanup();
      articleCleanup();
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/details", { withCredentials: true })
      .then((resp) => {
        setDetails(resp.data);
      })
      .catch((err) => {
        console.error("Error fetching details:", err);
      });
    axios
      .get("http://localhost:3000/admin/articles", { withCredentials: true })
      .then((resp) => {
        setArticles(resp.data);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
      });
    
      axios
      .get("http://localhost:3000/admin/getvideos", { withCredentials: true })
      .then((resp) => {
        setVideos(resp.data);
      })
      .catch((err) => {
        console.error("Error fetching Videos:", err);
      });

  }, []);

  if (!details || !articles) {
    return <div className="flex justify-center items-center h-screen bg-black text-green-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {isPlayer ? <NavbarPlay /> : <Navbar />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
          <h1 className="text-3xl font-bold text-green-400 mb-4">Welcome back, {details.UserName}!</h1>
          <button
            onClick={() => navigate('/ChessBoard')}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 text-black font-bold rounded-lg transition-all duration-300 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105"
          >
            Play Now!
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400">Games Played: 100</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400">Wins: 80</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400">Losses: 20</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400">Rating: 1300</p>
            </div>
          </div>
        </div>

        {/* Games Carousel */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Your Games</h2>
          <div className="relative">
            <button ref={scrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
            </button>
            <div ref={gameScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
              {['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5'].map((game, index) => (
                <div key={index} className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-sm flex items-center justify-center text-black font-semibold">
                  {game}
                </div>
              ))}
            </div>
            <button ref={scrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Videos Carousel */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Featured Videos</h2>
          <div className="relative">
            <button ref={videoScrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
            </button>
            <div ref={videoScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
            {videos.map((video, index) => (
                <div key={index} className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-sm flex items-center justify-center p-2 text-center text-black font-semibold">
                  {video.title}
                </div>
            ))}
            </div>
            <button ref={videoScrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Articles Carousel */}
        <div className="bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Featured Articles</h2>
          <div className="relative">
            <button ref={articleScrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
            </button>
            <div ref={articleScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
              {articles.map((article, index) => (
                <div key={index} className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-sm flex items-center justify-center p-2 text-center text-black font-semibold">
                  {article.title}
                </div>
              ))}
            </div>
            <button ref={articleScrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
              <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
