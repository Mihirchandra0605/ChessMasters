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
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [35, 50, 60, 65, 75, 85, 90, 105, 115, 125, 135, 150],
          backgroundColor: 'rgba(249, 115, 22, 0.5)',
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
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [40, 55, 65, 70, 80, 95, 105, 120, 130, 145, 160, 180],
          backgroundColor: 'rgba(249, 115, 22, 0.5)',
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
        }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg lg:shadow-xl overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">
            Views Analysis Dashboard
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
              className="block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 
                text-sm sm:text-base border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                bg-white transition-all duration-200"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className="h-48 sm:h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8">
            <Line data={dataByYear[selectedYear]} options={options} />
          </div>

          <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600">
            <p className="text-center">* Hover over data points to see detailed information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChart;
