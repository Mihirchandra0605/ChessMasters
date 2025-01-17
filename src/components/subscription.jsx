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
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubscriptionChart = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const data2023 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Subscriptions (2023)',
        data: [10, 15, 12, 18, 20, 25, 23, 27, 29, 19, 31, 32],
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  };

  const data2024 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Subscriptions (2024)',
        data: [12, 18, 14, 22, 26, 30, 28, 32, 34, 22, 35, 36],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const data = selectedYear === '2023' ? data2023 : data2024;

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
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg lg:shadow-xl overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
            Subscription Analysis
          </h1>
          
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
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8">
            <Bar 
              data={data} 
              options={options}
              className="w-full h-full"
            />
          </div>

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

