// // SubscriptionChart.js
// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js';
// import '../styles/subscription.css'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const SubscriptionChart = () => {
//   // Hardcoded data
//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December'],
//     datasets: [
//       {
//         label: 'Monthly Subscriptions',
//         data: [10, 15, 12, 18, 20, 25,23,27,29,19,31,32], // Hardcoded subscription counts
//         backgroundColor: 'darkyellow',
//         borderColor: 'darkorange',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: true, // Important for resizing
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: {
//             size: 14, // Adjust font size for labels
//           },
//           color: 'darkorange', // Legend label color
//         },
//       },
//       title: {
//         display: true,
//         text: 'Coach Subscriptions Analysis (Monthly)',
//         font: {
//           size: 25, // Adjust title font size
//         },
//         color: 'black', // Title color
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           font: {
//             size: 12, // Adjust font size for x-axis labels
//           },
//           color: 'black', // X-axis label color
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 1)', // X-axis gridline color
//         },
//       },
//       y: {
//         ticks: {
//           font: {
//             size: 12, // Adjust font size for y-axis labels
//           },
//           color: 'black', // Y-axis label color
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 1)', // Y-axis gridline color
//         },
//       },
//     },
//   };
  
//   return <div className='subscription'>
//   <Bar data={data} options={options} />
//         </div>
// };

// export default SubscriptionChart;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const SubscriptionChart = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [subscriptionData, setSubscriptionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to process subscription data
  const processSubscriptions = (subscribers) => {
    const years = {};
    
    subscribers.forEach(sub => {
      const date = new Date(sub.subscribedAt);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!years[year]) {
        years[year] = new Array(12).fill(0);
      }
      years[year][month]++;
    });

    return years;
  };

  // Generate a unique color for each year
  const generateColor = (index) => {
    const colors = [
      { bg: 'rgba(255, 99, 132, 0.8)', border: 'rgb(255, 99, 132)' },
      { bg: 'rgba(54, 162, 235, 0.8)', border: 'rgb(54, 162, 235)' },
      { bg: 'rgba(255, 206, 86, 0.8)', border: 'rgb(255, 206, 86)' },
      { bg: 'rgba(75, 192, 192, 0.8)', border: 'rgb(75, 192, 192)' },
      { bg: 'rgba(153, 102, 255, 0.8)', border: 'rgb(153, 102, 255)' },
      { bg: 'rgba(255, 159, 64, 0.8)', border: 'rgb(255, 159, 64)' }
    ];
    return colors[index % colors.length];
  };

  // Fetch subscription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachId = localStorage.getItem('userId');
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('authorization='))
          ?.split('=')[1];
    
        console.log('Coach ID:', coachId, 'Token:', token);
    
        if (!coachId || !token) {
          setError('Authentication required. Please login again.');
          navigate('/login');
          return;
        }
    
        const response = await axios.get(
          `http://localhost:3000/coach/subscribedPlayers/${coachId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Add Bearer prefix back
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );
    
        const processedData = processSubscriptions(response.data.subscribers);
        setSubscriptionData(processedData);
        
        const years = Object.keys(processedData);
        if (years.length > 0) {
          setSelectedYear(Math.max(...years).toString());
        }
        
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Session expired or unauthorized. Please login again.');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch subscription data');
        }
        setLoading(false);
      }
    };
    

    fetchData();
  }, [navigate]);

  const getChartData = (year) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearIndex = Object.keys(subscriptionData)
      .sort()
      .indexOf(year);
    const colors = generateColor(yearIndex);

    return {
      labels: months,
      datasets: [
        {
          label: `Monthly Subscriptions (${year})`,
          data: subscriptionData[year] || new Array(12).fill(0),
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
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
        labels: {
          font: {
            size: window.innerWidth < 640 ? 12 : 14,
            weight: 'bold',
          },
          color: '#4a5568',
          padding: window.innerWidth < 640 ? 10 : 20,
        },
      },
      title: {
        display: true,
        text: `Coach Subscriptions Analysis (${selectedYear})`,
        font: {
          size: window.innerWidth < 640 ? 16 : 20,
          weight: 'bold',
        },
        color: '#2d3748',
        padding: {
          top: window.innerWidth < 640 ? 5 : 10,
          bottom: window.innerWidth < 640 ? 15 : 30
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#4a5568',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#4a5568',
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  // Get available years from the subscription data
  const availableYears = Object.keys(subscriptionData).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg lg:shadow-xl overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
            Subscription Analysis
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

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
              className="block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm sm:text-base 
                border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 rounded-md transition-all duration-200
                bg-white shadow-sm"
            >
              {availableYears.length > 0 ? (
                availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              ) : (
                <option value="">No subscription data available</option>
              )}
            </select>
          </div>

          {availableYears.length > 0 ? (
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8">
              <Bar 
                data={getChartData(selectedYear)} 
                options={options}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-600">
              No subscription data available to display
            </div>
          )}

          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
            <p className="hidden sm:block">
              * Hover over the bars to see detailed information
            </p>
            <p className="sm:hidden">
              * Tap on the bars to see detailed information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionChart;



