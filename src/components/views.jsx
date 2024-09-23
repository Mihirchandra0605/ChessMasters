import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/views.css'; // Import the CSS file

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ViewChart = () => {
  // State to manage selected year
  const [selectedYear, setSelectedYear] = useState('2023');

  // Data for 2023 and 2024
  const dataByYear = {
    '2023': {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Video Views',
          data: [55, 68, 72, 85, 95, 110, 130, 150, 175, 190, 210, 230],
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          borderColor: 'rgba(0, 0, 0, 1)', // Opaque black 
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [35, 50, 60, 65, 75, 85, 90, 105, 115, 125, 135, 150],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          borderColor: 'rgba(0, 0, 0, 1)', // Opaque black          
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Article Views',
          data: [40, 55, 65, 70, 80, 95, 105, 120, 130, 145, 160, 180],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // To allow proper resizing
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
        text: `Views Analysis (Videos & Articles) - ${selectedYear}`,
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

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="views">
      <div className="year-selector">
        <label htmlFor="year">Select Year:</label>
        <select id="year" value={selectedYear} onChange={handleYearChange}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </div>
      <Line data={dataByYear[selectedYear]} options={options}/>
    </div>

  );
};

export default ViewChart;
