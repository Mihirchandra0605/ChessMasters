import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Add axios interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      // Redirect to login page on authentication failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const ViewChart = () => {
  const navigate = useNavigate();
  const { coachId } = useParams(); // Get coach ID from URL if available
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewData, setViewData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  // Function to process view data
  const processViewData = (videos, articles) => {
    console.log('Processing view data:');
    console.log('Videos:', videos);
    console.log('Articles:', articles);
    
    const years = {};
    
    // Process video views
    videos.forEach(video => {
      if (video.views && video.views.length > 0) {
        video.views.forEach(view => {
          const date = new Date(view.viewedAt);
          const year = date.getFullYear();
          const month = date.getMonth();
          
          if (!years[year]) {
            years[year] = {
              videoViews: new Array(12).fill(0),
              articleViews: new Array(12).fill(0)
            };
          }
          
          years[year].videoViews[month]++;
        });
      }
    });
    
    // Process article views
    articles.forEach(article => {
      if (article.views && article.views.length > 0) {
        article.views.forEach(view => {
          const date = new Date(view.viewedAt);
          const year = date.getFullYear();
          const month = date.getMonth();
          
          if (!years[year]) {
            years[year] = {
              videoViews: new Array(12).fill(0),
              articleViews: new Array(12).fill(0)
            };
          }
          
          years[year].articleViews[month]++;
        });
      }
    });
    
    console.log('Processed view data:', years);
    
    return years;
  };

  // Fetch view data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching coach content data...");
        
        // Get user details to get coach ID if not available from URL
        const userResponse = await axios.get("http://localhost:3000/auth/details", { 
          withCredentials: true 
        });
        
        // If coachId is not in URL params, try to get it from user data
        const activeCoachId = coachId || userResponse.data._id;
        
        console.log("👤 Active coach ID:", activeCoachId);
        
        if (!activeCoachId) {
          console.error("❌ No coach ID found");
          setError("Coach ID not found. Please try again.");
          setLoading(false);
          return;
        }
        
        // Fetch videos and articles for this coach specifically
        const [videosResponse, articlesResponse] = await Promise.all([
          axios.get(`http://localhost:3000/video/coach/${activeCoachId}`, {
            withCredentials: true
          }),
          axios.get(`http://localhost:3000/article/coach/${activeCoachId}`, {
            withCredentials: true
          })
        ]);
        
        const videosData = videosResponse.data || [];
        const articlesData = articlesResponse.data || [];
        
        console.log("📹 Videos fetched:", videosData.length);
        console.log("📝 Articles fetched:", articlesData.length);
        
        if (videosData.length === 0 && articlesData.length === 0) {
          console.warn("⚠️ No videos or articles found for this coach");
        }
        
        // Process the actual data from backend
        const processedData = processViewData(videosData, articlesData);
        setViewData(processedData);
        
        const years = Object.keys(processedData);
        if (years.length > 0) {
          setAvailableYears(years.sort((a, b) => b - a));
          setSelectedYear(Math.max(...years.map(Number)).toString());
        } else {
          // If no data was processed, set the current year
          const currentYear = new Date().getFullYear().toString();
          setAvailableYears([currentYear]);
          setSelectedYear(currentYear);
        }
        
        setError(null);
      } catch (error) {
        console.error("❌ Error fetching view data:", error);
        setError("Failed to load view data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [coachId]);

  const getChartData = (year) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearData = viewData[year] || {
      videoViews: new Array(12).fill(0),
      articleViews: new Array(12).fill(0)
    };

    return {
      labels: months,
      datasets: [
        {
          label: 'Video Views',
          data: yearData.videoViews,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: yearData.articleViews,
          backgroundColor: 'rgba(249, 115, 22, 0.5)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          boxWidth: window.innerWidth < 640 ? 12 : 40,
          padding: window.innerWidth < 640 ? 10 : 20,
          font: {
            size: window.innerWidth < 640 ? 10 : 14,
            weight: 'bold',
          },
          color: '#4B5563',
        },
      },
      title: {
        display: true,
        text: `Views Analysis (${selectedYear})`,
        font: {
          size: window.innerWidth < 640 ? 14 : 20,
          weight: 'bold',
        },
        color: '#1F2937',
        padding: {
          top: window.innerWidth < 640 ? 5 : 10,
          bottom: window.innerWidth < 640 ? 15 : 30
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
          display: window.innerWidth > 640,
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: window.innerWidth < 640 ? 8 : 12,
          },
          maxRotation: window.innerWidth < 640 ? 45 : 0,
        }
      },
      y: {
        grid: {
          color: 'rgba(209, 213, 219, 0.5)',
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: window.innerWidth < 640 ? 8 : 12,
          },
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  const hasData = Object.keys(viewData).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg lg:shadow-xl overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
            Views Analysis Dashboard
          </h1>
          
          {hasData ? (
            <>
              <div className="mb-3 sm:mb-4 md:mb-6">
                <label 
                  htmlFor="year" 
                  className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                >
                  Select Year:
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 
                    text-sm sm:text-base border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                    bg-white transition-all duration-200"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="h-48 sm:h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8">
                <Line data={getChartData(selectedYear)} options={options} />
              </div>
              
              <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
                <p className="hidden sm:block text-center">* Hover over data points to see detailed information</p>
                <p className="sm:hidden text-center">* Tap on data points to see detailed information</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-lg font-medium text-gray-700 mb-4">No view data available yet.</p>
              <p className="text-sm text-gray-500">Views will appear here once players start viewing your content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewChart;
