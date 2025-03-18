// import React, { useEffect, useState } from 'react';
// import { BsPeopleFill,BsCurrencyDollar, BsFilePlus,BsFillBarChartLineFill, BsFillFileEarmarkTextFill, BsCashStack } from 'react-icons/bs';
// import AdminNav from './adminnav.jsx';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { AddForm } from './AddForm.jsx';

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [players, setPlayers] = useState([]);
//   const [coaches, setCoaches] = useState([]);
//   const [articles, setArticles] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [subscriptions, setsubscriptions] = useState(0);
//   const [gamesCount, setGamesCount] = useState(0);
//   const [games, setGames] = useState([]);
//   const [searchTerms, setSearchTerms] = useState({
//     articles: '',
//     videos: '',
//     players: '',
//     coaches: ''
//   });
//   const [expandedStat, setExpandedStat] = useState(null);
//   const [graphData, setGraphData] = useState([]);
//   const [ ShowAlert, setShowAlert] = useState(false)
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [inputValues, setInputValues] = useState({
//     articles: '',
//     videos: '',
//     players: '',
//     coaches: ''
//   });

//   const handleAddClick = (e) => {
//     e.preventDefault();
//     setIsFormVisible(true);
//   };

//   const handleFormSubmit = (formData) => {
//     // Handle form submission logic here
//     console.log('Form Submitted:', formData);
//     fetch("http://localhost:3000/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log(data);
//         setShowAlert(true);
//         setTimeout(() => {
//           setShowAlert(false);
//           onSignupSuccess();
//         }, 3000);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("An error occurred during signup. Please try again.");
//       });
//     navigate("/AdminDashboard"); // Adjust the route as needed
//   };

//   const calculateTotalSubscriptions = (data) => {
//     console.log(data); // Logs the input data for debugging

//     // Sum up the lengths of the 'subscribers' arrays for each coach
//     const totalSubscriptions = data.reduce(
//       (total, coach) => total + (coach.subscribers ? coach.subscribers.length : 0),
//       0
//     );

//     return totalSubscriptions;
//   };

//   const fetchData = async (endpoint, setterFunction) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/admin/${endpoint}`);
//       console.log(`${endpoint} data:`, response.data);
//       setterFunction(response.data);
//       if (endpoint === 'coaches') {
//         setsubscriptions(calculateTotalSubscriptions(response.data));
//       }
//     } catch (error) {
//       console.error(`Error fetching ${endpoint}:`, error);
//     }
//   };

//   const fetchGamesCount = async () => {
//     try {
//       const response = await axios.get("http://localhost:3000/game/allgames");
//       const games = Array.isArray(response.data.games) ? response.data.games : [];
//       console.log("Games data:", games);
//       setGamesCount(games.length);
//       setGames(games);
//       // Calculate count from array length
//     } catch (error) {
//       console.error("Error fetching games:", error);
//       setGamesCount(0); // Default to 0 in case of an error
//       setGames([]); // Set empty array in case of error
//     }
//   };

//   useEffect(() => {
//     fetchData('players', setPlayers);
//     fetchData('coaches', setCoaches);
//     fetchData('articles', setArticles);
//     fetchData('videos', setVideos);
//     fetchGamesCount();
//   }, []);

//   const handleDelete = async (id, type) => {
//     if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
//     try {
//       const endpoint = type === 'coach' ? 'coaches' : `${type}s`;
//       await axios.delete(`http://localhost:3000/admin/${endpoint}/${id}`);
//       fetchData(
//         type === 'coach' ? 'coaches' : `${type}s`,
//         type === 'player' ? setPlayers : type === 'coach' ? setCoaches : type === 'article' ? setArticles : setVideos
//       );
//     } catch (error) {
//       console.error(`Error deleting ${type}:`, error);
//     }
//   };

//   const handleSearch = (field) => (e) => {
//     const value = e.target.value;
//     setInputValues(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSearchSubmit = (field) => () => {
//     setSearchTerms(prev => ({ ...prev, [field]: inputValues[field] }));
//   };

//   const filterData = (data, searchTerm, key = 'title') => {
//     if (!Array.isArray(data)) return [];
//     return data.filter(item => {
//       if (key === 'UserName') {
//         const username = item.user?.UserName || item.UserName || 'N/A';
//         return username.toLowerCase().includes(searchTerm.toLowerCase());
//       }
//       return String(item[key] || '').toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   };

//   const StatCard = ({ title, count, icon: Icon, gradient, onClick }) => (
//     <div
//       className={`${gradient} rounded-xl shadow-xl p-4 md:p-6 h-[150px] 
//         hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 
//         hover:scale-105 relative overflow-hidden backdrop-blur-sm ${onClick ? 'cursor-pointer' : ''}
//         before:content-[''] before:absolute before:top-0 before:left-0 
//         before:w-full before:h-full before:bg-white/10 before:opacity-0 
//         hover:before:opacity-100 before:transition-opacity`}
//       onClick={onClick}
//     >
//       <div className="flex justify-between items-center mb-4 relative z-10">
//         <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-lg">{title}</h3>
//         <Icon className="text-2xl md:text-3xl text-white opacity-80 animate-pulse" />
//       </div>
//       <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider drop-shadow-lg relative z-10">
//         {count}
//       </h1>
//     </div>
//   );

//   const ContentSection = ({ title, data, onDelete, gradient, itemKey = 'title' }) => {
//     const [localSearchTerm, setLocalSearchTerm] = useState('');
//     const [filteredItems, setFilteredItems] = useState(data);
    
//     // Update filtered items when data or searchTerm changes
//     useEffect(() => {
//       if (!Array.isArray(data)) {
//         setFilteredItems([]);
//         return;
//       }
      
//       if (!localSearchTerm) {
//         setFilteredItems(data);
//         return;
//       }
      
//       const filtered = data.filter(item => {
//         if (itemKey === 'UserName') {
//           const username = item.user?.UserName || item.UserName || 'N/A';
//           return username.toLowerCase().includes(localSearchTerm.toLowerCase());
//         }
//         return String(item[itemKey] || '').toLowerCase().includes(localSearchTerm.toLowerCase());
//       });
      
//       setFilteredItems(filtered);
//     }, [data, localSearchTerm, itemKey]);
    
//     const handleLocalSearch = (e) => {
//       setLocalSearchTerm(e.target.value);
//     };
    
//     // Get badge color based on rating/ELO
//     const getBadgeColor = (value) => {
//       if (!value || isNaN(Number(value))) return 'bg-gray-200 text-gray-700';
      
//       const numValue = Number(value);
//       if (numValue >= 2000) return 'bg-purple-600 text-white';
//       if (numValue >= 1800) return 'bg-blue-600 text-white';
//       if (numValue >= 1600) return 'bg-green-600 text-white';
//       if (numValue >= 1400) return 'bg-yellow-500 text-gray-900';
//       if (numValue >= 1200) return 'bg-orange-500 text-white';
//       return 'bg-red-500 text-white';
//     };

//     // Log data for debugging
//     useEffect(() => {
//       if (title === 'Coaches') {
//         console.log('Coach data:', data);
//       }
//     }, [data, title]);

//     return (
//       <div className={`${gradient} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 
//         border border-white/20 min-h-[300px] hover:shadow-2xl 
//         transition-all duration-500 transform hover:scale-[1.01]`}>
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl md:text-2xl font-bold 
//             bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text 
//             text-transparent tracking-wide">{title}</h3>
            
//           {/* Display legend for Players and Coaches */}
//           {(title === 'Players' || title === 'Coaches') && (
//             <div className="text-xs md:text-sm text-gray-600 bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
//               {title === 'Players' ? 'Username - ELO Rating' : 'Username - Coach Rating & ELO'}
//             </div>
//           )}
//         </div>
        
//         {/* Search input */}
//         <div className="relative mb-6">
//           <input
//             type="text"
//             placeholder={`Search ${title}...`}
//             value={localSearchTerm}
//             onChange={handleLocalSearch}
//             className="w-full p-4 border rounded-xl focus:ring-4 
//               focus:outline-none bg-white/60 backdrop-blur-md shadow-inner
//               transition-all duration-300 hover:bg-white/80 
//               placeholder-gray-500 text-gray-700"
//           />
//           {localSearchTerm && (
//             <button
//               onClick={() => setLocalSearchTerm('')}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//           )}
//         </div>
        
//         {/* Display count of filtered items */}
//         <p className="text-sm text-gray-600 mb-4">
//           Showing {filteredItems.length} of {data.length} {title.toLowerCase()}
//         </p>
        
//         {/* List of items */}
//         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//           {filteredItems.length > 0 ? (
//             filteredItems.map(item => {
//               // Determine what to render based on item type
//               let username, rating, elo;
//               console.log('item', item);
              
//               if (title === 'Players') {
//                 username = item.user?.UserName || item.UserName || 'N/A';
//                 elo = item.elo || '1200'; // Use elo for players
//               } else if (title === 'Coaches') {
//                 username = item.user?.UserName || item.UserName || 'N/A';
//                 rating = item.rating || 'N/A';
                
//                 // For coaches, we need to check multiple possible locations for ELO
//                 // This is because coach ELO might be in different places depending on the API
//                 elo = item.user.elo || '1200'; // Default to 1200 if not found
//               }
              
//               return (
//                 <div key={item._id}
//                   className="flex flex-col md:flex-row justify-between items-start 
//                     md:items-center p-5 bg-white/50 hover:bg-white/70 rounded-xl 
//                     border border-white/40 transition-all duration-300 
//                     hover:shadow-lg group backdrop-blur-sm"
//                 >
//                   {title === 'Players' ? (
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
//                       <span className="text-base md:text-lg font-semibold text-gray-800">
//                         {username}
//                       </span>
//                       <div className={`${getBadgeColor(elo)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
//                         ELO: {elo}
//                       </div>
//                     </div>
//                   ) : title === 'Coaches' ? (
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 flex-wrap">
//                       <span className="text-base md:text-lg font-semibold text-gray-800">
//                         {username}
//                       </span>
//                       <div className="flex flex-wrap gap-2">
//                         <div className={`${getBadgeColor(rating)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
//                           Rating: {rating}
//                         </div>
//                         <div className={`${getBadgeColor(elo)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
//                           ELO: {elo}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="text-sm md:text-base text-gray-800 font-medium truncate max-w-full md:max-w-[70%]">
//                       {item[itemKey]}
//                     </span>
//                   )}
                  
//                   <button
//                     onClick={() => onDelete(item._id)}
//                     className="mt-3 md:mt-0 px-5 py-2 bg-red-500 hover:bg-red-600 text-white 
//                       rounded-lg transition-all duration-300 text-sm md:text-base
//                       shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-8 text-gray-500 bg-white/30 rounded-xl backdrop-blur-sm">
//               No {title.toLowerCase()} found matching your search.
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const handleStatClick = (stat) => {
//     setExpandedStat(stat);
//     generateGraphData(stat);
//   };

//   const generateGraphData = (stat) => {
//     let data = [];
//     const today = new Date();
//     // Initialize data with last 7 days
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(today.getDate() - i);
//       const day = date.toISOString().split('T')[0];
//       data.push({ date: day, count: 0 });
//     }

//     const dateMap = {};
//     data.forEach(item => {
//       dateMap[item.date] = item;
//     });

//     switch (stat) {
//       case 'Users':
//         const allUsers = [...players, ...coaches];
//         // Simply set today's count to the total number of users
//         const today = new Date().toISOString().split('T')[0];
//         if (dateMap[today]) {
//           dateMap[today].count = allUsers.length;
//         }
        
//         // Original code that tries to group by createdAt date
//         // This part can be kept as a fallback but may not work if createdAt is missing
//         allUsers.forEach(user => {
//           if (user.createdAt) {
//             try {
//               const createdAtDate = new Date(user.createdAt);
//               if (!isNaN(createdAtDate.getTime())) {
//                 const createdAt = createdAtDate.toISOString().split('T')[0];
//                 if (dateMap[createdAt] && createdAt !== today) {
//                   dateMap[createdAt].count += 1;
//                 }
//               }
//             } catch (error) {
//               console.warn("Error processing date for user:", user._id);
//             }
//           }
//         });
//         break;

//       case 'Games Played':
//         if (!games || games.length === 0) {
//           const todayDate = new Date().toISOString().split('T')[0];
//           if (dateMap[todayDate]) {
//             dateMap[todayDate].count = gamesCount;
//           }
//         } else {
//           games.forEach(game => {
//             if (game.datePlayed) {
//               try {
//                 const gameDate = new Date(game.datePlayed).toISOString().split('T')[0];
//                 if (dateMap[gameDate]) {
//                   dateMap[gameDate].count += 1;
//                 }
//               } catch (error) {
//                 console.warn("Invalid date for game:", game);
//               }
//             } else if (game.createdAt) {
//               try {
//                 const gameDate = new Date(game.createdAt).toISOString().split('T')[0];
//                 if (dateMap[gameDate]) {
//                   dateMap[gameDate].count += 1;
//                 }
//               } catch (error) {
//                 console.warn("Invalid date for game:", game);
//               }
//             }
//           });
          
//           const hasDataPoints = Object.values(dateMap).some(item => item.count > 0);
//           if (!hasDataPoints) {
//             const todayDate = new Date().toISOString().split('T')[0];
//             if (dateMap[todayDate]) {
//               dateMap[todayDate].count = gamesCount;
//             }
//           }
//         }
//         break;
//       case 'Content':
//         const allContent = [...articles, ...videos];
//         allContent.forEach(content => {
//           const createdAt = new Date(content.createdAt).toISOString().split('T')[0];
//           if (dateMap[createdAt]) {
//             dateMap[createdAt].count += 1;
//           }
//         });
//         break;
//       case 'Subscriptions':
//         // Assuming subscriptions have a created date
//         const allCoaches = coaches;
//         console.log('allCoaches', allCoaches);
//         allCoaches.forEach(coach => {
//           if (coach.subscribers && Array.isArray(coach.subscribers)) {
//             coach.subscribers.forEach(sub => {
//               if (sub.subscribedAt) { // Ensure subscribedAt exists
//                 const subscribedDate = new Date(sub.subscribedAt);
//                 if (!isNaN(subscribedDate.getTime())) { // Ensure it's a valid date
//                   const subscribedAt = subscribedDate.toISOString().split('T')[0];
//                   if (dateMap[subscribedAt]) {
//                     dateMap[subscribedAt].count += 1;
//                   }
//                 } else {
//                   console.warn('Invalid date:', sub.subscribedAt);
//                 }
//               } else {
//                 console.warn('Missing subscribedAt:', sub);
//               }
//             });
//           }
//         });
//         break;

//       default:
//         break;
//     }

//     setGraphData(data);
//   };

//   const closeGraph = () => {
//     setExpandedStat(null);
//     setGraphData([]);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 
//       to-pink-100 p-4 md:p-8 animate-gradient-x">
//       <AdminNav />
//       <div className="mb-8 md:mb-16 pt-6 md:pt-8">
//         <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r 
//           from-purple-600 via-indigo-600 to-blue-600 bg-clip-text 
//           text-transparent tracking-tight hover:tracking-wide 
//           transition-all duration-300">
//           OVERVIEW
//         </h3>
//       </div>
//       {!expandedStat ? (
//         <>
//         {isFormVisible && (
//         <AddForm
//           onClose={() => setIsFormVisible(false)}
//           onSubmit={handleFormSubmit}
//         />
//       )}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             <StatCard
//               title="Users"
//               count={`${players.length} Players, ${coaches.length} Coaches`}
//               icon={BsPeopleFill}
//               gradient="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"
//               onClick={() => handleStatClick('Users')}
//             />
//             <StatCard
//               title="Games Played"
//               count={`${gamesCount} Games`}
//               icon={BsFillBarChartLineFill}
//               gradient="bg-gradient-to-br from-pink-600 via-rose-600 to-red-700"
//               onClick={() => handleStatClick('Games Played')}
//             />
//             <StatCard
//               title="Content"
//               count={`${articles.length} Articles, ${videos.length} Videos`}
//               icon={BsFillFileEarmarkTextFill}
//               gradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"
//               onClick={() => handleStatClick('Content')}
//             />
//             <StatCard
//               title="Subscriptions"
//               count={subscriptions}
//               icon={BsCashStack}
//               gradient="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"
//               onClick={() => handleStatClick('Subscriptions')}
//             />
//              <StatCard
//               title="Add"
//               icon={BsFilePlus}
//               gradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"
//               onClick={handleAddClick}
//             />
//             <StatCard
//               title="Revenue"
//               count={Math.floor(((subscriptions * 9.9) / 2) * 1000) / 1000}
//               icon={BsCurrencyDollar}
//               gradient="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"
//             />
//           </div>
//           <div className="mt-8 md:mt-12 space-y-8">
//             <ContentSection
//               title="Articles"
//               data={articles}
//               onDelete={(id) => handleDelete(id, 'article')}
//               gradient="bg-gradient-to-br from-fuchsia-50/90 to-pink-50/90"
//             />
//             <ContentSection
//               title="Videos"
//               data={videos}
//               onDelete={(id) => handleDelete(id, 'video')}
//               gradient="bg-gradient-to-br from-violet-50/90 to-purple-50/90"
//             />
//             <ContentSection
//               title="Players"
//               data={players}
//               onDelete={(id) => handleDelete(id, 'player')}
//               gradient="bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
//               itemKey="UserName"
//             />
//             <ContentSection
//               title="Coaches"
//               data={coaches}
//               onDelete={(id) => handleDelete(id, 'coach')}
//               gradient="bg-gradient-to-br from-emerald-50/90 to-teal-50/90"
//               itemKey="UserName"
//             />
//           </div>
//         </>
//       ) : (
//         <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl md:text-3xl font-bold">{expandedStat} Over the Last 7 Days</h3>
//             <button
//               onClick={closeGraph}
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white 
//                 rounded-lg transition-all duration-300 text-sm md:text-base
//                 shadow-md hover:shadow-xl"
//             >
//               Close
//             </button>
//           </div>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart
//               data={graphData}
//               margin={{
//                 top: 5, right: 30, left: 20, bottom: 5,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </main>
//   );
// };

// export default Dashboard;








import React, { useEffect, useState } from 'react';
import { BsPeopleFill,BsCurrencyDollar, BsFilePlus,BsFillBarChartLineFill, BsFillFileEarmarkTextFill, BsCashStack } from 'react-icons/bs';
import AdminNav from './adminnav.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AddForm } from './AddForm.jsx';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subscriptions, setsubscriptions] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [games, setGames] = useState([]);
  const [searchTerms, setSearchTerms] = useState({
    articles: '',
    videos: '',
    players: '',
    coaches: ''
  });
  const [expandedStat, setExpandedStat] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [ ShowAlert, setShowAlert] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [inputValues, setInputValues] = useState({
    articles: '',
    videos: '',
    players: '',
    coaches: ''
  });

  const handleAddClick = (e) => {
    e.preventDefault();
    setIsFormVisible(true);
  };

  const [stats, setStats] = useState({
        totalGamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDraw: 0,
        elo: 0,
      });
      const [showStats, setShowStats] = useState({ show: false, title: '' });

  const handleViewStats = async (id, title) => {
    try {
      let response;
      if (title === 'Players') {
        response = await axios.get(`http://localhost:3000/player/${id}/game-stats`, { withCredentials: true });
      } else if (title === 'Coaches') {
        response = await axios.get(`http://localhost:3000/coach/${id}/game-stats`, { withCredentials: true });
      }
      console.log('Stats data:', response.data);
      setStats(response.data); // Update stats state
      setShowStats({ show: true, title }); // Show stats modal or section with title
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFormSubmit = (formData) => {
    // Handle form submission logic here
    console.log('Form Submitted:', formData);
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          onSignupSuccess();
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred during signup. Please try again.");
      });
    navigate("/AdminDashboard"); // Adjust the route as needed
  };

  const calculateTotalSubscriptions = (data) => {
    console.log(data); // Logs the input data for debugging

    // Sum up the lengths of the 'subscribers' arrays for each coach
    const totalSubscriptions = data.reduce(
      (total, coach) => total + (coach.subscribers ? coach.subscribers.length : 0),
      0
    );

    return totalSubscriptions;
  };

  const fetchData = async (endpoint, setterFunction) => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/${endpoint}`);
      console.log(`${endpoint} data:`, response.data);
      setterFunction(response.data);
      if (endpoint === 'coaches') {
        setsubscriptions(calculateTotalSubscriptions(response.data));
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const fetchGamesCount = async () => {
    try {
      const response = await axios.get("http://localhost:3000/game/allgames");
      const games = Array.isArray(response.data.games) ? response.data.games : [];
      console.log("Games data:", games);
      setGamesCount(games.length);
      setGames(games);
      // Calculate count from array length
    } catch (error) {
      console.error("Error fetching games:", error);
      setGamesCount(0); // Default to 0 in case of an error
      setGames([]); // Set empty array in case of error
    }
  };

  useEffect(() => {
    fetchData('players', setPlayers);
    fetchData('coaches', setCoaches);
    fetchData('articles', setArticles);
    fetchData('videos', setVideos);
    fetchGamesCount();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === 'coach' ? 'coaches' : `${type}s`;
      await axios.delete(`http://localhost:3000/admin/${endpoint}/${id}`);
      fetchData(
        type === 'coach' ? 'coaches' : `${type}s`,
        type === 'player' ? setPlayers : type === 'coach' ? setCoaches : type === 'article' ? setArticles : setVideos
      );
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleSearch = (field) => (e) => {
    const value = e.target.value;
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = (field) => () => {
    setSearchTerms(prev => ({ ...prev, [field]: inputValues[field] }));
  };

  const filterData = (data, searchTerm, key = 'title') => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      if (key === 'UserName') {
        const username = item.user?.UserName || item.UserName || 'N/A';
        return username.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return String(item[key] || '').toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const StatCard = ({ title, count, icon: Icon, gradient, onClick }) => (
    <div
      className={`${gradient} rounded-xl shadow-xl p-4 md:p-6 h-[150px] 
        hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 
        hover:scale-105 relative overflow-hidden backdrop-blur-sm ${onClick ? 'cursor-pointer' : ''}
        before:content-[''] before:absolute before:top-0 before:left-0 
        before:w-full before:h-full before:bg-white/10 before:opacity-0 
        hover:before:opacity-100 before:transition-opacity`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-lg">{title}</h3>
        <Icon className="text-2xl md:text-3xl text-white opacity-80 animate-pulse" />
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider drop-shadow-lg relative z-10">
        {count}
      </h1>
    </div>
  );

  const ContentSection = ({ title, data, onDelete, gradient, itemKey = 'title' }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState(data);
    
    // Update filtered items when data or searchTerm changes
    useEffect(() => {
      if (!Array.isArray(data)) {
        setFilteredItems([]);
        return;
      }
      
      if (!localSearchTerm) {
        setFilteredItems(data);
        return;
      }
      
      const filtered = data.filter(item => {
        if (itemKey === 'UserName') {
          const username = item.user?.UserName || item.UserName || 'N/A';
          return username.toLowerCase().includes(localSearchTerm.toLowerCase());
        }
        return String(item[itemKey] || '').toLowerCase().includes(localSearchTerm.toLowerCase());
      });
      
      setFilteredItems(filtered);
    }, [data, localSearchTerm, itemKey]);
    
    const handleLocalSearch = (e) => {
      setLocalSearchTerm(e.target.value);
    };
    
    // Get badge color based on rating/ELO
    const getBadgeColor = (value) => {
      if (!value || isNaN(Number(value))) return 'bg-gray-200 text-gray-700';
      
      const numValue = Number(value);
      if (numValue >= 2000) return 'bg-purple-600 text-white';
      if (numValue >= 1800) return 'bg-blue-600 text-white';
      if (numValue >= 1600) return 'bg-green-600 text-white';
      if (numValue >= 1400) return 'bg-yellow-500 text-gray-900';
      if (numValue >= 1200) return 'bg-orange-500 text-white';
      return 'bg-red-500 text-white';
    };

    // Log data for debugging
    useEffect(() => {
      if (title === 'Coaches') {
        console.log('Coach data:', data);
      }
    }, [data, title]);

    return (
      <div className={`${gradient} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 
        border border-white/20 min-h-[300px] hover:shadow-2xl 
        transition-all duration-500 transform hover:scale-[1.01]`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold 
            bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text 
            text-transparent tracking-wide">{title}</h3>
            
          {/* Display legend for Players and Coaches */}
          {(title === 'Players' || title === 'Coaches') && (
            <div className="text-xs md:text-sm text-gray-600 bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
              {title === 'Players' ? 'Username - ELO Rating' : 'Username - Coach Rating & ELO'}
            </div>
          )}
        </div>
        
        {/* Search input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder={`Search ${title}...`}
            value={localSearchTerm}
            onChange={handleLocalSearch}
            className="w-full p-4 border rounded-xl focus:ring-4 
              focus:outline-none bg-white/60 backdrop-blur-md shadow-inner
              transition-all duration-300 hover:bg-white/80 
              placeholder-gray-500 text-gray-700"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Display count of filtered items */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredItems.length} of {data.length} {title.toLowerCase()}
        </p>
        
        {/* List of items */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => {
              // Determine what to render based on item type
              let username, rating, elo;
              console.log('item', item);
              
              if (title === 'Players') {
                username = item.user?.UserName || item.UserName || 'N/A';
                elo = item.elo || '1200'; // Use elo for players
              } else if (title === 'Coaches') {
                username = item.user?.UserName || item.UserName || 'N/A';
                rating = item.rating || 'N/A';
                
                // For coaches, we need to check multiple possible locations for ELO
                // This is because coach ELO might be in different places depending on the API
                elo = item.user.elo || '1200'; // Default to 1200 if not found
              }
              
              return (
                <div key={item._id}
                  className="flex flex-col md:flex-row justify-between items-start 
                    md:items-center p-5 bg-white/50 hover:bg-white/70 rounded-xl 
                    border border-white/40 transition-all duration-300 
                    hover:shadow-lg group backdrop-blur-sm"
                >
                  {title === 'Players' ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                      <span className="text-base md:text-lg font-semibold text-gray-800">
                        {username}
                      </span>
                      <div className={`${getBadgeColor(elo)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
                        ELO: {elo}
                      </div>
                    </div>
                  ) : title === 'Coaches' ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 flex-wrap">
                      <span className="text-base md:text-lg font-semibold text-gray-800">
                        {username}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <div className={`${getBadgeColor(rating)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
                          Rating: {rating}
                        </div>
                        <div className={`${getBadgeColor(elo)} px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm`}>
                          ELO: {elo}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm md:text-base text-gray-800 font-medium truncate max-w-full md:max-w-[70%]">
                      {item[itemKey]}
                    </span>
                  )}
                  
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <button
                      onClick={() => onDelete(item._id)}
                      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white 
                        rounded-lg transition-all duration-300 text-sm md:text-base
                        shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                    {(title === 'Players') && (
                      <button
                        onClick={() => handleViewStats(item._id, title)}
                        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                          rounded-lg transition-all duration-300 text-sm md:text-base
                          shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Stats
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white/30 rounded-xl backdrop-blur-sm">
              No {title.toLowerCase()} found matching your search.
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleStatClick = (stat) => {
    setExpandedStat(stat);
    generateGraphData(stat);
  };

  const generateGraphData = (stat) => {
    let data = [];
    const today = new Date();
    // Initialize data with last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const day = date.toISOString().split('T')[0];
      data.push({ date: day, count: 0 });
    }

    const dateMap = {};
    data.forEach(item => {
      dateMap[item.date] = item;
    });

    switch (stat) {
      case 'Users':
        const allUsers = [...players, ...coaches];
        // Simply set today's count to the total number of users
        const today = new Date().toISOString().split('T')[0];
        if (dateMap[today]) {
          dateMap[today].count = allUsers.length;
        }
        
        // Original code that tries to group by createdAt date
        // This part can be kept as a fallback but may not work if createdAt is missing
        allUsers.forEach(user => {
          if (user.createdAt) {
            try {
              const createdAtDate = new Date(user.createdAt);
              if (!isNaN(createdAtDate.getTime())) {
                const createdAt = createdAtDate.toISOString().split('T')[0];
                if (dateMap[createdAt] && createdAt !== today) {
                  dateMap[createdAt].count += 1;
                }
              }
            } catch (error) {
              console.warn("Error processing date for user:", user._id);
            }
          }
        });
        break;

      case 'Games Played':
        if (!games || games.length === 0) {
          const todayDate = new Date().toISOString().split('T')[0];
          if (dateMap[todayDate]) {
            dateMap[todayDate].count = gamesCount;
          }
        } else {
          games.forEach(game => {
            if (game.datePlayed) {
              try {
                const gameDate = new Date(game.datePlayed).toISOString().split('T')[0];
                if (dateMap[gameDate]) {
                  dateMap[gameDate].count += 1;
                }
              } catch (error) {
                console.warn("Invalid date for game:", game);
              }
            } else if (game.createdAt) {
              try {
                const gameDate = new Date(game.createdAt).toISOString().split('T')[0];
                if (dateMap[gameDate]) {
                  dateMap[gameDate].count += 1;
                }
              } catch (error) {
                console.warn("Invalid date for game:", game);
              }
            }
          });
          
          const hasDataPoints = Object.values(dateMap).some(item => item.count > 0);
          if (!hasDataPoints) {
            const todayDate = new Date().toISOString().split('T')[0];
            if (dateMap[todayDate]) {
              dateMap[todayDate].count = gamesCount;
            }
          }
        }
        break;
      case 'Content':
        const allContent = [...articles, ...videos];
        allContent.forEach(content => {
          const createdAt = new Date(content.createdAt).toISOString().split('T')[0];
          if (dateMap[createdAt]) {
            dateMap[createdAt].count += 1;
          }
        });
        break;
      case 'Subscriptions':
        // Assuming subscriptions have a created date
        const allCoaches = coaches;
        console.log('allCoaches', allCoaches);
        allCoaches.forEach(coach => {
          if (coach.subscribers && Array.isArray(coach.subscribers)) {
            coach.subscribers.forEach(sub => {
              if (sub.subscribedAt) { // Ensure subscribedAt exists
                const subscribedDate = new Date(sub.subscribedAt);
                if (!isNaN(subscribedDate.getTime())) { // Ensure it's a valid date
                  const subscribedAt = subscribedDate.toISOString().split('T')[0];
                  if (dateMap[subscribedAt]) {
                    dateMap[subscribedAt].count += 1;
                  }
                } else {
                  console.warn('Invalid date:', sub.subscribedAt);
                }
              } else {
                console.warn('Missing subscribedAt:', sub);
              }
            });
          }
        });
        break;

      default:
        break;
    }

    setGraphData(data);
  };

  const closeGraph = () => {
    setExpandedStat(null);
    setGraphData([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 
      to-pink-100 p-4 md:p-8 animate-gradient-x">
      <AdminNav />
      <div className="mb-8 md:mb-16 pt-6 md:pt-8">
        <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r 
          from-purple-600 via-indigo-600 to-blue-600 bg-clip-text 
          text-transparent tracking-tight hover:tracking-wide 
          transition-all duration-300">
          OVERVIEW
        </h3>
      </div>
      {!expandedStat ? (
        <>
        {isFormVisible && (
        <AddForm
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
        />
      )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Users"
              count={`${players.length} Players, ${coaches.length} Coaches`}
              icon={BsPeopleFill}
              gradient="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"
              onClick={() => handleStatClick('Users')}
            />
            <StatCard
              title="Games Played"
              count={`${gamesCount} Games`}
              icon={BsFillBarChartLineFill}
              gradient="bg-gradient-to-br from-pink-600 via-rose-600 to-red-700"
              onClick={() => handleStatClick('Games Played')}
            />
            <StatCard
              title="Content"
              count={`${articles.length} Articles, ${videos.length} Videos`}
              icon={BsFillFileEarmarkTextFill}
              gradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"
              onClick={() => handleStatClick('Content')}
            />
            <StatCard
              title="Subscriptions"
              count={subscriptions}
              icon={BsCashStack}
              gradient="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"
              onClick={() => handleStatClick('Subscriptions')}
            />
             <StatCard
              title="Add"
              icon={BsFilePlus}
              gradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"
              onClick={handleAddClick}
            />
            <StatCard
              title="Revenue"
              count={Math.floor(((subscriptions * 9.9) / 2) * 1000) / 1000}
              icon={BsCurrencyDollar}
              gradient="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"
            />
          </div>
          <div className="mt-8 md:mt-12 space-y-8">
            <ContentSection
              title="Articles"
              data={articles}
              onDelete={(id) => handleDelete(id, 'article')}
              gradient="bg-gradient-to-br from-fuchsia-50/90 to-pink-50/90"
            />
            <ContentSection
              title="Videos"
              data={videos}
              onDelete={(id) => handleDelete(id, 'video')}
              gradient="bg-gradient-to-br from-violet-50/90 to-purple-50/90"
            />
            <ContentSection
  title="Players"
  data={players}
  onDelete={(id) => handleDelete(id, 'player')}
  gradient="bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
  itemKey="UserName"
  handleViewStats={handleViewStats}
/>
            <ContentSection
              title="Coaches"
              data={coaches}
              onDelete={(id) => handleDelete(id, 'coach')}
              gradient="bg-gradient-to-br from-emerald-50/90 to-teal-50/90"
              itemKey="UserName"
            />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl md:text-3xl font-bold">{expandedStat} Over the Last 7 Days</h3>
            <button
              onClick={closeGraph}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white 
                rounded-lg transition-all duration-300 text-sm md:text-base
                shadow-md hover:shadow-xl"
            >
              Close
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={graphData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {showStats.show && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">{showStats.title === 'Players' ? 'Player Stats' : 'Coach Stats'}</h2>
      <p>Total Games Played: {stats.totalGamesPlayed}</p>
      <p>Games Won: {stats.gamesWon}</p>
      <p>Games Lost: {stats.gamesLost}</p>
      <p>Games Draw: {stats.gamesDraw}</p>
      <p>ELO: {stats.elo}</p>
      <button
        onClick={() => setShowStats({ show: false, title: '' })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}
    </main>
  );
};

export default Dashboard;