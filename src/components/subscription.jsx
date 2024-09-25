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
import '../styles/subscription.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubscriptionChart = () => {
  // State to manage selected year
  const [selectedYear, setSelectedYear] = useState('2023');

  // Hardcoded data for 2023 and 2024
  const data2023 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Subscriptions (2023)',
        data: [10, 15, 12, 18, 20, 25, 23, 27, 29, 19, 31, 32], // Hardcoded 2023 subscription counts
        backgroundColor: 'darkyellow',
        borderColor: 'darkorange',
        borderWidth: 1,
      },
    ],
  };

  const data2024 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Subscriptions (2024)',
        data: [12, 18, 14, 22, 26, 30, 28, 32, 34, 22, 35, 36], // Hardcoded 2024 subscription counts
        backgroundColor: 'darkblue',
        borderColor: 'darkgreen',
        borderWidth: 1,
      },
    ],
  };

  // Choose data based on selected year
  const data = selectedYear === '2023' ? data2023 : data2024;

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: 'darkorange',
        },
      },
      title: {
        display: true,
        text: `Coach Subscriptions Analysis (${selectedYear})`,
        font: {
          size: 25,
        },
        color: 'black',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: 'black',
        },
        grid: {
          color: 'rgba(0, 0, 0, 1)',
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
          color: 'black',
        },
        grid: {
          color: 'rgba(0, 0, 0, 1)',
        },
      },
    },
  };

  return (
    <div className='subscription'>
      {/* Dropdown to select year */}
      <div className="year-selector">
        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      {/* Chart rendering based on selected year */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default SubscriptionChart;

