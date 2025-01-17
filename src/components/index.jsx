// import React, { useRef, useEffect, useState } from "react";
// import { useSearchParams, useNavigate,Link } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import NavbarPlay from "./navbarplay.jsx";
// import axios from "axios";

// function HomePage() {
//   const navigate = useNavigate();
//   const [details, setDetails] = useState(null);
//   const [articles, setArticles] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [games, setGames] = useState([]);
//   const [searchParams] = useSearchParams();
//   const [isPlayer, setIsPlayer] = useState(searchParams.get('role') === 'player');

//   const gameScrollContainerRef = useRef(null);
//   const scrollLeftRef = useRef(null);
//   const scrollRightRef = useRef(null);
//   const videoScrollContainerRef = useRef(null);
//   const videoScrollLeftRef = useRef(null);
//   const videoScrollRightRef = useRef(null);
//   const articleScrollContainerRef = useRef(null);
//   const articleScrollLeftRef = useRef(null);
//   const articleScrollRightRef = useRef(null);

//   useEffect(() => {
//     const setupScroll = (scrollContainer, scrollLeftButton, scrollRightButton) => {
//       const scrollLeft = () => {
//         if (scrollContainer) {
//           scrollContainer.scrollBy({ left: -100, behavior: "smooth" });
//         }
//       };
//       const scrollRight = () => {
//         if (scrollContainer) {
//           scrollContainer.scrollBy({ left: 100, behavior: "smooth" });
//         }
//       };
//       if (scrollLeftButton) {
//         scrollLeftButton.addEventListener("click", scrollLeft);
//       }
//       if (scrollRightButton) {
//         scrollRightButton.addEventListener("click", scrollRight);
//       }
//       return () => {
//         if (scrollLeftButton) {
//           scrollLeftButton.removeEventListener("click", scrollLeft);
//         }
//         if (scrollRightButton) {
//           scrollRightButton.removeEventListener("click", scrollRight);
//         }
//       };
//     };

//     const gameCleanup = setupScroll(
//       gameScrollContainerRef.current,
//       scrollLeftRef.current,
//       scrollRightRef.current
//     );
//     const videoCleanup = setupScroll(
//       videoScrollContainerRef.current,
//       videoScrollLeftRef.current,
//       videoScrollRightRef.current
//     );
//     const articleCleanup = setupScroll(
//       articleScrollContainerRef.current,
//       articleScrollLeftRef.current,
//       articleScrollRightRef.current
//     );

//     return () => {
//       gameCleanup();
//       videoCleanup();
//       articleCleanup();
//     };
//   }, []);

//   useEffect(() => {
//     axios
//     .get("http://localhost:3000/game/allgames", { withCredentials: true })
//     .then((resp) => {
//       setGames(resp.data);
//     })
//     .catch((err) => {
//       console.error("Error fetching Games:", err);
//     });
    
//     axios
//       .get("http://localhost:3000/auth/details", { withCredentials: true })
//       .then((resp) => {
//         setDetails(resp.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching details:", err);
//       });
//     axios
//       .get("http://localhost:3000/admin/articles", { withCredentials: true })
//       .then((resp) => {
//         setArticles(resp.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching articles:", err);
//       });
    
//       axios
//       .get("http://localhost:3000/admin/getvideos", { withCredentials: true })
//       .then((resp) => {
//         setVideos(resp.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching Videos:", err);
//       });

//   }, []);

//   if (!details || !articles) {
//     return <div className="flex justify-center items-center h-screen bg-black text-green-400">Loading...</div>;
//   }
  
//   // When a player joins ---> room 
//   // When player 2 joins ---> player1 room id emit ---> player 2 id emit 
//   // player1 and player2 will save these values as opponentId


//   return (
//     <div className="min-h-screen bg-black text-green-400">
//       {isPlayer ? <NavbarPlay /> : <Navbar />}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
//           <h1 className="text-3xl font-bold text-green-400 mb-4">Welcome back, {details.UserName}!</h1>
//           <button
//             onClick={() => navigate('/ChessBoard')}
//             className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-700 text-black font-bold rounded-lg transition-all duration-300 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105"
//           >
//             Play Now!
//           </button>
//         </div>

//         <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
//           <h2 className="text-2xl font-semibold text-green-400 mb-4">Stats</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
//             <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
//               <p className="font-medium text-green-400">Games Played: 100</p>
//             </div>
//             <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
//               <p className="font-medium text-green-400">Wins: 80</p>
//             </div>
//             <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
//               <p className="font-medium text-green-400">Losses: 20</p>
//             </div>
//             <div className="p-3 bg-gray-800 rounded-lg border border-green-500">
//               <p className="font-medium text-green-400">Rating: 1300</p>
//             </div>
//           </div>
//         </div>

//         {/* Games Carousel
//         <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
//           <h2 className="text-2xl font-semibold text-green-400 mb-4">Your Games</h2>
//           <div className="relative">
//             <button ref={scrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
//             </button>
//             <div ref={gameScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
//               {games.map((game, index) => (
//                   <div className="inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
//                       game played on :{game.datePlayed}
//                       game winner color is :{game.winner}
//                   </div>
//               ))}
//             </div>
//             <button ref={scrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
//             </button>
//           </div>
//         </div> */}

//         {/* Games Carousel */}
// <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
//   <h2 className="text-2xl font-semibold text-green-400 mb-4">Your Games</h2>
//   <div className="relative">
//     <button ref={scrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//       <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
//     </button>
//     <div ref={gameScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
//       {games.map((game, index) => (
//         <div key={game._id} className="inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
//           <p>Game played on: {new Date(game.datePlayed).toLocaleDateString()}</p>
//           <p>Winner: {game.winner}</p>
//         </div>
//       ))}
//     </div>
//     <button ref={scrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//       <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
//     </button>
//   </div>
// </div>

//         {/* Videos Carousel */}
//         <div className="bg-gray-900 rounded-xl shadow-md p-6 mb-8 border-l-4 border-green-500">
//           <h2 className="text-2xl font-semibold text-green-400 mb-4">Featured Videos</h2>
//           <div className="relative">
//             <button ref={videoScrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
//             </button>
//             <div ref={videoScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
//             {videos.map((video, index) => (
//                   <Link to={`/Videodetail/${video._id}`} className="inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
//                   {video.title}
//               </Link>
//             ))}
//             </div>
//             <button ref={videoScrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Articles Carousel */}
//         <div className="bg-gray-900 rounded-xl shadow-md p-6 border-l-4 border-green-500">
//           <h2 className="text-2xl font-semibold text-green-400 mb-4">Featured Articles</h2>
//           <div className="relative">
//             <button ref={articleScrollLeftRef} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/back.png" alt="Scroll Left" className="w-6 h-6" />
//             </button>
//             <div ref={articleScrollContainerRef} className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
//               {articles.map((article, index) => (
//                   <Link to={`/Articledetail/${article._id}`} className="inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300">
//                       {article.title}
//                   </Link>
//               ))}
//             </div>
//             <button ref={articleScrollRightRef} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-700 rounded-full p-2 shadow-md z-10 hover:bg-green-600">
//               <img src="/public/next.png" alt="Scroll Right" className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;








import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx";
import axios from "axios";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: ['Wins', 'Losses'],
  datasets: [
    {
      data: [80, 20],
      backgroundColor: ['#10B981', '#EF4444'],
      hoverBackgroundColor: ['#059669', '#DC2626'],
    },
  ],
};

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
    .get("http://localhost:3000/game/allgames", { withCredentials: true })
    .then((resp) => {
      setGames(Array.isArray(resp.data) ? resp.data : resp.data.games || []);
    })
    .catch((err) => {
      console.error("Error fetching Games:", err);
      setGames([]);
    });

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

        {/* Stats Section */}
        <div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                      p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center text-green-400 
                       mb-3 sm:mb-4">
            Stats
          </h2>
          {!showStats ? (
            <button onClick={() => setShowStats(true)}
                    className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 
                             to-green-700 text-black font-bold rounded-lg transition-all duration-300 
                             hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 
                             focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 
                             text-sm sm:text-base">
              View
            </button>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 
                           text-center mb-4">
                {/* Stats Cards */}
                <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
                  <p className="font-medium text-green-400 text-sm sm:text-base">Games Played: 100</p>
                </div>
                <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
                  <p className="font-medium text-green-400 text-sm sm:text-base">Wins: 80</p>
                </div>

                <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
                  <p className="font-medium text-green-400 text-sm sm:text-base">Losses: 20</p>
                </div>

                <div className="p-2 sm:p-3 bg-gray-800 rounded-lg border border-green-500">
                  <p className="font-medium text-green-400 text-sm sm:text-base">Rating: 1300</p>
                </div>

      </div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto 
                           h-48 sm:h-56 md:h-64 mb-4">
                <Pie data={chartData} options={chartOptions} />
              </div>

              <button onClick={() => setShowStats(false)}
                      className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 
                               to-green-700 text-black font-bold rounded-lg transition-all duration-300 
                               hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 
                               focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 
                               text-sm sm:text-base">
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
      {games.map((game) => (
        <div key={game._id} 
             className="flex-shrink-0 inline-block bg-green-500 text-white 
                      font-medium sm:font-semibold py-2 sm:py-3 px-3 sm:px-4 
                      rounded-lg hover:bg-green-600 transition-all duration-300 
                      text-center text-sm sm:text-base transform hover:scale-105">
          <p>Game played on: {new Date(game.datePlayed).toLocaleDateString()}</p>
          <p>Winner: {game.winner}</p>
        </div>
      ))}
    </div>
  </div>
</div>


{/* Videos Section */}
<div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-l-4 border-green-500">
  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
    Featured Videos
  </h2>
  <div className="relative">
    <div ref={videoScrollContainerRef} 
         className="flex overflow-x-auto space-x-3 sm:space-x-4 
                  items-center px-2 sm:px-4 min-h-[120px] sm:min-h-[150px]
                  scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
      {videos.map((video) => (
        <Link key={video._id} 
              to={`/Videodetail/${video._id}`} 
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

{/* Articles Section */}
<div className="bg-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md 
                p-4 sm:p-6 lg:p-8 border-l-4 border-green-500">
  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center text-green-400 
                mb-3 sm:mb-4 lg:mb-6">
    Featured Articles
  </h2>
  <div className="relative">
    <div ref={articleScrollContainerRef} 
         className="flex overflow-x-auto space-x-3 sm:space-x-4 
                  items-center px-2 sm:px-4 min-h-[120px] sm:min-h-[150px]
                  scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-800">
      {articles.map((article) => (
        <Link key={article._id} 
              to={`/Articledetail/${article._id}`} 
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


      </div>
    </div>
  );
}

export default HomePage;
