import React, { useEffect, useState } from 'react';
import { BsPeopleFill, BsFillBarChartLineFill, BsFillFileEarmarkTextFill, BsCashStack } from 'react-icons/bs';
import AdminNav from './adminnav.jsx';
import axios from 'axios';
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
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subscriptions, setsubscriptions] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [searchTerms, setSearchTerms] = useState({
    articles: '',
    videos: '',
    players: '',
    coaches: ''
  });
  const [expandedStat, setExpandedStat] = useState(null);
  const [graphData, setGraphData] = useState([]);

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
      // Calculate count from array length
    } catch (error) {
      console.error("Error fetching games:", error);
      setGamesCount(0); // Default to 0 in case of an error
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
      await axios.delete(`http://localhost:3000/admin/${type}s/${id}`);
      fetchData(
        `${type}s`,
        type === 'player' ? setPlayers : type === 'coach' ? setCoaches : type === 'article' ? setArticles : setVideos
      );
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleSearch = (field) => (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchTerms(prev => ({ ...prev, [field]: value }));
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
        hover:scale-105 relative overflow-hidden backdrop-blur-sm cursor-pointer
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

  const ContentSection = ({ title, data, searchTerm, onSearch, onDelete, gradient, itemKey = 'title' }) => {
    const inputRef = React.useRef(null);

    const renderContent = (item) => {
      if (title === 'Players' || title === 'Coaches') {
        const username = item.user?.UserName || item.UserName || 'N/A';
        const rating = item.rating || 'N/A';
        return `${username} - ${rating}`;
      }
      return item[itemKey];
    };

    return (
      <div className={`${gradient} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 
        border border-white/20 min-h-[300px] hover:shadow-2xl 
        transition-all duration-500 transform hover:scale-[1.01]`}>
        <h3 className="text-xl md:text-2xl font-bold mb-6 
          bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text 
          text-transparent tracking-wide">{title}</h3>
        <input
          ref={inputRef}
          type="text"
          placeholder={`Search ${title}...`}
          value={searchTerm}
          onChange={onSearch}
          autoComplete="off"
          className="w-full p-4 border rounded-xl mb-6 focus:ring-4 
            focus:outline-none bg-white/60 backdrop-blur-md shadow-inner
            transition-all duration-300 hover:bg-white/80 
            placeholder-gray-500 text-gray-700"
        />
        <ul className="space-y-4">
          {filterData(data, searchTerm, itemKey).map(item => (
            <li key={item._id}
              className="flex flex-col md:flex-row justify-between items-start 
                md:items-center p-5 bg-white/50 hover:bg-white/70 rounded-xl 
                border border-white/40 transition-all duration-300 
                hover:shadow-lg group">
              <span className="text-sm md:text-base text-gray-800 mb-2 md:mb-0 
                font-medium group-hover:text-gray-900">
                {renderContent(item)}
              </span>
              <button
                onClick={() => onDelete(item._id)}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white 
                  rounded-lg transition-all duration-300 text-sm md:text-base
                  shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
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
        allUsers.forEach(user => {
          // Validate createdAt
          if (!user.createdAt) {
            console.warn("Missing createdAt for user:", user);
            return; // Skip this iteration
          }

          const createdAtDate = new Date(user.createdAt);
          if (isNaN(createdAtDate.getTime())) {
            console.warn("Invalid date value for user:", user.createdAt);
            return; // Skip this iteration
          }

          const createdAt = createdAtDate.toISOString().split('T')[0];
          if (dateMap[createdAt]) {
            dateMap[createdAt].count += 1;
          }
        });
        break;

      case 'Games Played':
        const allGames = Array.isArray(games) ? games : [];
        console.log('allGames', allGames);
        allGames.forEach(game => {
          const datePlayed = new Date(game.datePlayed).toISOString().split('T')[0];
          if (dateMap[datePlayed]) {
            dateMap[datePlayed].count += 1;
          }
        });
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
          </div>
          <div className="mt-8 md:mt-12 space-y-8">
            <ContentSection
              title="Articles"
              data={articles}
              searchTerm={searchTerms.articles}
              onSearch={handleSearch('articles')}
              onDelete={(id) => handleDelete(id, 'article')}
              gradient="bg-gradient-to-br from-fuchsia-50/90 to-pink-50/90"
            />
            <ContentSection
              title="Videos"
              data={videos}
              searchTerm={searchTerms.videos}
              onSearch={handleSearch('videos')}
              onDelete={(id) => handleDelete(id, 'video')}
              gradient="bg-gradient-to-br from-violet-50/90 to-purple-50/90"
            />
            <ContentSection
              title="Players"
              data={players}
              searchTerm={searchTerms.players}
              onSearch={handleSearch('players')}
              onDelete={(id) => handleDelete(id, 'player')}
              gradient="bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
              itemKey="UserName"
            />
            <ContentSection
              title="Coaches"
              data={coaches}
              searchTerm={searchTerms.coaches}
              onSearch={handleSearch('coaches')}
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
    </main>
  );
};

export default Dashboard;