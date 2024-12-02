// // EarningsChart.jsx
// import React, { useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// import '../styles/earnings.css'; // Import the CSS file

// ChartJS.register(ArcElement, Tooltip, Legend, Title);

// const EarningsChart = () => {
//   const [year, setYear] = useState('2023');

//   // Hardcoded data for coach earnings based on selected year
//   const data2023 = [500, 700, 600, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600];
//   const data2024 = [600, 800, 700, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];
  
//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//     datasets: [
//       {
//         label: 'Earnings',
//         data: year === '2023' ? data2023 : data2024,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.7)',
//           'rgba(54, 162, 235, 0.7)',
//           'rgba(255, 206, 86, 0.7)',
//           'rgba(75, 192, 192, 0.7)',
//           'rgba(153, 102, 255, 0.7)',
//           'rgba(255, 159, 64, 0.7)',
//           'rgba(99, 255, 132, 0.7)',
//           'rgba(162, 54, 235, 0.7)',
//           'rgba(206, 255, 86, 0.7)',
//           'rgba(192, 75, 192, 0.7)',
//           'rgba(102, 153, 255, 0.7)',
//           'rgba(159, 255, 64, 0.7)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//           'rgba(99, 255, 132, 1)',
//           'rgba(162, 54, 235, 1)',
//           'rgba(206, 255, 86, 1)',
//           'rgba(192, 75, 192, 1)',
//           'rgba(102, 153, 255, 1)',
//           'rgba(159, 255, 64, 1)',
//         ],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: {
//             size: 14,
//           },
//           color: '#333',
//         },
//       },
//       title: {
//         display: true,
//         text: `Coach Earnings per Month (${year})`, // Dynamic title based on year
//         font: {
//           size: 25,
//         },
//         color: '#444',
//       },
//     },
//   };

//   return (
//     <div className="earnings-chart-container">
//       <div className="year-selector">
//         <label htmlFor="year">Select Year:</label>
//         <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
//           <option value="2023">2023</option>
//           <option value="2024">2024</option>
//         </select>
//       </div>
//       <Pie data={data} options={options} />
//     </div>
//   );
// };

// export default EarningsChart;



// EarningsChart.jsx
import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EarningsChart = () => {
  const [year, setYear] = useState('2023');

  // Hardcoded data for coach earnings based on selected year
  const data2023 = [500, 700, 600, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600];
  const data2024 = [600, 800, 700, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700];

  const totalEarnings2023 = data2023.reduce((acc, curr) => acc + curr, 0);
  const totalEarnings2024 = data2024.reduce((acc, curr) => acc + curr, 0);
  const totalCombinedEarnings = totalEarnings2023 + totalEarnings2024;

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Earnings',
        data: year === '2023' ? data2023 : data2024,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(99, 255, 132, 0.7)',
          'rgba(162, 54, 235, 0.7)',
          'rgba(206, 255, 86, 0.7)',
          'rgba(192, 75, 192, 0.7)',
          'rgba(102, 153, 255, 0.7)',
          'rgba(159, 255, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(99, 255, 132, 1)',
          'rgba(162, 54, 235, 1)',
          'rgba(206, 255, 86, 1)',
          'rgba(192, 75, 192, 1)',
          'rgba(102, 153, 255, 1)',
          'rgba(159, 255, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: `Coach Earnings per Month (${year})`,
        font: {
          size: 25,
        },
        color: '#444',
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Earnings Dashboard</h1>
          <div className="mb-6">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Select Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="h-96 mb-8">
            <Pie data={data} options={options} />
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Earnings Summary</h2>
            <p className="text-lg text-gray-600 mb-2">
              Total Earnings for {year}: <span className="font-bold text-indigo-600">${year === '2023' ? totalEarnings2023 : totalEarnings2024}</span>
            </p>
            <p className="text-lg text-gray-600">
              Combined Earnings (2023 & 2024): <span className="font-bold text-indigo-600">${totalCombinedEarnings}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;