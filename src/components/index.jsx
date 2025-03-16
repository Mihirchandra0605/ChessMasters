import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx";
import axios from "axios";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#10B981',
      },
    },
  },
};

function HomePage() {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [articles, setArticles] = useState(null);
  const [videos, setVideos] = useState([]);
  const [games, setGames] = useState([]);
  const [searchParams] = useSearchParams();
  const [isPlayer, setIsPlayer] = useState(searchParams.get('role') === 'player');

  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    totalGamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDraw: 0,
    elo: 0,
  });

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
  
        if (resp.data.Role === "player" || resp.data.Role === "coach"){
          axios
            .get("http://localhost:3000/game/mygames", { withCredentials: true })
            .then((resp) => {
              setGames(Array.isArray(resp.data.games) ? resp.data.games : []);
            })
            .catch((err) => {
              console.error("Error fetching user games:", err);
              setGames([]);
            });
          }
          if (resp.data.Role === "player"){
          axios
            .get("http://localhost:3000/player/subscribed-articles", { withCredentials: true })
            .then((resp) => {
              console.log('articles data', resp.data);
              setArticles(resp.data);
            })
            .catch((err) => {
              console.error("Error fetching articles:", err);
              setArticles([]);
            });
  
          axios
            .get("http://localhost:3000/player/subscribed-videos", { withCredentials: true })
            .then((resp) => {
              console.log('videos data', resp.data);
              setVideos(resp.data);
            })
            .catch((err) => {
              console.error("Error fetching videos:", err);
              setVideos([]);
            });
        } else {
          setArticles([]);
          setVideos([]);
          axios
            .get("http://localhost:3000/admin/getvideos", { withCredentials: true })
            .then((resp) => {
              setVideos(resp.data);
            })
            .catch((err) => {
              console.error("Error fetching Videos:", err);
              setVideos([]);
            });
        }
      })
      .catch((err) => {
        console.error("Error fetching details:", err);
      });
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/player/${details._id}/game-stats`, { withCredentials: true });
      console.log('stats data', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (showStats && details) {
      fetchStats();
    }
  }, [showStats, details]);

  const chartData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        data: [stats.gamesWon, stats.gamesLost, stats.gamesDraw],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        hoverBackgroundColor: ['#059669', '#DC2626', '#D97706'],
      },
    ],
  };

  const recordVideoView = async (videoId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/video/${videoId}/view`,
        {},
        { withCredentials: true }
      );
      
      toast.success("View recorded");
      
      console.log("Video view recorded successfully");
      return true;
    } catch (error) {
      console.error("Error recording video view:", error);
      return false;
    }
  };

  const recordArticleView = async (articleId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/article/${articleId}/view`,
        {},
        { withCredentials: true }
      );
      
      toast.success("View recorded");
      
      console.log("Article view recorded successfully");
      return true;
    } catch (error) {
      console.error("Error recording article view:", error);
      return false;
    }
  };

  if (!details || !articles) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-400 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {isPlayer ? <NavbarPlay /> : <Navbar />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 
                      mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold text-green-400 
                       mb-3 sm:mb-4">
            Welcome back, {details.UserName}!
          </h1>
          <button onClick={() => navigate('/ChessBoard')} 
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 
                           to-green-700 text-black font-bold rounded-lg transition-all duration-300 
                           hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 
                           focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 
                           text-sm sm:text-base">
            Play Now!
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center text-green-400 mb-3 sm:mb-4">
        Stats
      </h2>
      {!showStats ? (
        <button onClick={() => setShowStats(true)}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-green-700 text-black font-bold rounded-lg transition-all duration-300 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 text-sm sm:text-base">
          View
        </button>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-center mb-4">
            <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400 text-sm sm:text-base">Games Played: {stats.totalGamesPlayed}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400 text-sm sm:text-base">Wins: {stats.gamesWon}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400 text-sm sm:text-base">Losses: {stats.gamesLost}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400 text-sm sm:text-base">Draws: {stats.gamesDraw}</p>
            </div>
            <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
              <p className="font-medium text-green-400 text-sm sm:text-base">Rating: {stats.elo}</p>
            </div>
          </div>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto h-48 sm:h-56 md:h-64 mb-4">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
          <button onClick={() => setShowStats(false)}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-green-700 text-black font-bold rounded-lg transition-all duration-300 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 text-sm sm:text-base">
            Back
          </button>
        </div>
      )}
    </div>
{/* Games Section */}
        <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
    Your Games
  </h2>
  <div className="relative">
    <div ref={gameScrollContainerRef} 
         className="flex overflow-x-auto space-x-3 sm:space-x-4 
                  items-center px-2 sm:px-4 min-h-[120px] sm:min-h-[150px]
                  scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
      {games.map((game) => {
        // Determine if current user won, lost, or drew
        const isUserWhite = game.playerWhite?._id === details._id;
        const isUserBlack = game.playerBlack?._id === details._id;
        const userWon = (isUserWhite && game.winner === "White") || (isUserBlack && game.winner === "Black");
        const userLost = (isUserWhite && game.winner === "Black") || (isUserBlack && game.winner === "White");
        const isDraw = game.winner === "Draw";
        
        // Set background color based on result
        const bgColor = userWon ? "bg-green-600" : userLost ? "bg-red-600" : "bg-gray-600";
        const hoverBgColor = userWon ? "hover:bg-green-700" : userLost ? "hover:bg-red-700" : "hover:bg-gray-700";
        
        // Set result text
        const resultText = userWon ? "You won" : userLost ? "You lost" : "Draw";
        
        return (
          <div key={game._id} 
               className={`flex-shrink-0 inline-block ${bgColor} text-white 
                        font-medium sm:font-semibold py-2 sm:py-3 px-3 sm:px-4 
                        rounded-lg ${hoverBgColor} transition-all duration-300 
                        text-center text-sm sm:text-base transform hover:scale-105`}>
            <p className="font-bold">{game.playerWhite?.UserName} vs {game.playerBlack?.UserName}</p>
            <p className="font-bold">{resultText}</p>
            <p className="text-xs sm:text-sm">{new Date(game.datePlayed).toLocaleDateString()}</p>
          </div>
        );
      })}
    </div>
  </div>
</div>


{/* Videos Section */}
{isPlayer && videos && videos.length > 0 && (
  <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
      Subscribed Videos
    </h2>
    <div className="relative">
      <div ref={videoScrollContainerRef} 
          className="flex overflow-x-auto space-x-3 sm:space-x-4 
                  items-center px-2 sm:px-4 min-h-[120px] sm:min-h-[150px]
                  scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
        {videos.map((video) => (
          <Link key={video._id} 
                to={`/Videodetail/${video._id}`} 
                onClick={() => {
                  // Record video view when clicked
                  recordVideoView(video._id);
                }}
                className="flex-shrink-0 inline-flex items-center justify-center 
                        bg-green-500 text-white font-medium sm:font-semibold 
                        py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-600 
                        transition-all duration-300 text-sm sm:text-base 
                        transform hover:scale-105">
            {video.title}
          </Link>
        ))}
      </div>
    </div>
  </div>
)}

{/* Articles Section */}
{isPlayer && articles && articles.length > 0 && (
  <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 border-l-4 border-green-500">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
      Subscribed Articles
    </h2>
    <div className="relative">
      <div ref={articleScrollContainerRef} 
          className="flex overflow-x-auto space-x-3 sm:space-x-4 
                  items-center px-2 sm:px-4 min-h-[120px] sm:min-h-[150px]
                  scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
        {articles.map((article) => (
          <Link key={article._id} 
                to={`/Articledetail/${article._id}`}
                onClick={() => {
                  // Record article view when clicked
                  recordArticleView(article._id);
                }}
                className="flex-shrink-0 inline-flex items-center justify-center 
                        bg-green-500 text-white font-medium sm:font-semibold 
                        py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-600 
                        transition-all duration-300 text-sm sm:text-base 
                        transform hover:scale-105">
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

export default HomePage;
