import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx";
import axios from "axios";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import { Book } from 'lucide-react';
import { motion } from "framer-motion";
import { mihirBackend } from "../../config.js";

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
      .get(`${mihirBackend}/auth/details`, { withCredentials: true })
      .then((resp) => {
        setDetails(resp.data);
  
        if (resp.data.Role === "player" || resp.data.Role === "coach"){
          axios
            .get(`${mihirBackend}/game/mygames`, { withCredentials: true })
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
            .get(`${mihirBackend}/player/subscribed-articles`, { withCredentials: true })
            .then((resp) => {
              console.log('articles data', resp.data);
              setArticles(resp.data);
            })
            .catch((err) => {
              console.error("Error fetching articles:", err);
              setArticles([]);
            });
  
          axios
            .get(`${mihirBackend}/player/subscribed-videos`, { withCredentials: true })
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
            .get(`${mihirBackend}/admin/getvideos`, { withCredentials: true })
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
      const response = await axios.get(`${mihirBackend}/player/${details._id}/game-stats`, { withCredentials: true });
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
        `${mihirBackend}/video/${videoId}/view`,
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
        `${mihirBackend}/article/${articleId}/view`,
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
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button onClick={() => navigate('/ChessBoard')} 
                    className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 
                             to-green-700 text-black font-bold rounded-lg transition-all duration-300 
                             hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 
                             focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 
                             text-sm sm:text-base">
              Play Now!
            </button>
            
            <motion.button 
              onClick={() => navigate('/rules')}
              className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-4 sm:px-6 
                       bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold 
                       rounded-lg shadow-md hover:shadow-lg transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 
                       transform hover:scale-105 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Book size={18} />
              Game Rules
            </motion.button>
          </div>
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

        <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
            Your Games
          </h2>
          <div className="relative">
            <div ref={gameScrollContainerRef} 
                 className="flex overflow-x-auto overflow-y-hidden space-x-3 sm:space-x-4 
                          items-center px-2 sm:px-4 h-[280px]
                          scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
              {games.map((game) => {
                // Determine if current user won, lost, or drew
                const isUserWhite = game.playerWhite?._id === details._id;
                const isUserBlack = game.playerBlack?._id === details._id;
                const userWon = (isUserWhite && game.winner === "White") || (isUserBlack && game.winner === "Black");
                const userLost = (isUserWhite && game.winner === "Black") || (isUserBlack && game.winner === "White");
                const isDraw = game.winner === "Draw";
                
                // Set colors based on result
                const bgGradient = userWon 
                  ? "from-green-900 to-green-700" 
                  : userLost 
                    ? "from-red-900 to-red-700" 
                    : "from-yellow-900 to-yellow-700";
                
                const borderColor = userWon 
                  ? "border-green-400" 
                  : userLost 
                    ? "border-red-400" 
                    : "border-yellow-400";
                
                const resultColor = userWon 
                  ? "text-green-300" 
                  : userLost 
                    ? "text-red-300" 
                    : "text-yellow-300";
                    
                // Set result text and icon
                const resultText = userWon ? "Victory" : userLost ? "Defeat" : "Draw";
                const resultIcon = userWon 
                  ? "♔" // King for victory
                  : userLost 
                    ? "♖" // Rook for defeat
                    : "♘"; // Knight for draw
                
                // Handle player names with deleted user check
                const whitePlayerName = game.playerWhite?.UserName || "Deleted User";
                const blackPlayerName = game.playerBlack?.UserName || "Deleted User";
                
                const isWhiteDeleted = !game.playerWhite?.UserName;
                const isBlackDeleted = !game.playerBlack?.UserName;
                
                // Format date nicely
                const gameDate = new Date(game.datePlayed);
                const formattedDate = gameDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                });
                
                // Game end reason, if available (shortened to fit)
                const gameReason = game.additionalAttributes?.reason 
                  ? game.additionalAttributes.reason.toLowerCase()
                  : "";
                
                return (
                  <div key={game._id} 
                       className={`flex-shrink-0 w-64 sm:w-72 h-[240px] bg-gradient-to-br ${bgGradient} text-white 
                                rounded-xl border ${borderColor} shadow-lg overflow-hidden
                                transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                                backdrop-blur-sm flex flex-col`}>
                    {/* Header with result */}
                    <div className={`flex items-center justify-center p-2 bg-black/30 border-b ${borderColor}`}>
                      <span className="text-xl mr-2">{resultIcon}</span>
                      <h3 className={`text-lg font-bold ${resultColor}`}>{resultText}</h3>
                    </div>
                    
                    {/* Player matchup - simplified */}
                    <div className="p-2 flex-grow-0 flex flex-col items-center border-b border-gray-700">
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-white mr-1"></div>
                          <span className={`${isWhiteDeleted ? "text-yellow-300" : "text-white"} font-medium text-sm truncate max-w-[120px]`}>
                            {whitePlayerName}
                          </span>
                        </div>
                        <span className="text-white/70 text-xs">{isUserWhite ? "(You)" : ""}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400 my-0.5">vs</div>
                      
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-black mr-1"></div>
                          <span className={`${isBlackDeleted ? "text-yellow-300" : "text-white"} font-medium text-sm truncate max-w-[120px]`}>
                            {blackPlayerName}
                          </span>
                        </div>
                        <span className="text-white/70 text-xs">{isUserBlack ? "(You)" : ""}</span>
                      </div>
                    </div>
                    
                    {/* Game details - simplified */}
                    <div className="p-3 bg-black/20 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="text-xs text-gray-300">
                          <span className="mr-1">📅</span> {formattedDate}
                        </div>
                        
                        {gameReason && (
                          <div className="text-xs text-gray-300 mt-1">
                            <span className="mr-1">🏆</span> 
                            {isDraw ? `Draw by ${gameReason}` : userWon ? `Win by ${gameReason}` : `Loss by ${gameReason}`}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/ViewGame/${game._id}`);
                        }}
                        className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 
                                 text-white py-2 px-3 rounded-lg transition-all duration-300
                                 group border border-white/30 hover:border-white/50 backdrop-blur-sm
                                 font-medium mt-2"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-300">♟</span>
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 text-sm">Review Game</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
