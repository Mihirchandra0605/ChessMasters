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
import '../styles/earnings.css'; // Import the CSS file

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
        text: `Coach Earnings per Month (${year})`, // Dynamic title based on year
        font: {
          size: 25,
        },
        color: '#444',
      },
    },
  };

  return (
    <div className="earnings-chart-container">
      <div className="year-selector">
        <label htmlFor="year">Select Year:</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <Pie data={data} options={options} />
      <div className="earnings-summary">
        <h2>Total Earnings for {year}: ${year === '2023' ? totalEarnings2023 : totalEarnings2024}</h2>
        <h2>Combined Earnings (2023 & 2024): ${totalCombinedEarnings}</h2>
      </div>
    </div>
  );
};

export default EarningsChart;
