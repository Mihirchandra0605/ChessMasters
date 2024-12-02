import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ViewChart = () => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const dataByYear = {
    '2023': {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Video Views',
          data: [55, 68, 72, 85, 95, 110, 130, 150, 175, 190, 210, 230],
          backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [35, 50, 60, 65, 75, 85, 90, 105, 115, 125, 135, 150],
          backgroundColor: 'rgba(249, 115, 22, 0.5)', // Orange
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    '2024': {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Video Views',
          data: [60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 220, 250],
          backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [40, 55, 65, 70, 80, 95, 105, 120, 130, 145, 160, 180],
          backgroundColor: 'rgba(249, 115, 22, 0.5)', // Orange
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
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
            weight: 'bold',
          },
          color: '#4B5563', // Gray-600
        },
      },
      title: {
        display: true,
        text: `Views Analysis (Videos & Articles) - ${selectedYear}`,
        font: {
          size: 20,
          weight: 'bold',
        },
        color: '#1F2937', // Gray-800
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(209, 213, 219, 0.5)', // Gray-300 with opacity
        },
        ticks: {
          color: '#4B5563', // Gray-600
        }
      },
      y: {
        grid: {
          color: 'rgba(209, 213, 219, 0.5)', // Gray-300 with opacity
        },
        ticks: {
          color: '#4B5563', // Gray-600
        }
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Views Analysis Dashboard</h1>
          <div className="mb-6">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">Select Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="h-96 mb-8">
            <Line data={dataByYear[selectedYear]} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChart;