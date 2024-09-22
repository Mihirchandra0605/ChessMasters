import React from 'react';
import {
  BsFillArchiveFill, BsPeopleFill, BsFillBellFill, BsFillEnvelopeFill, BsFillFileEarmarkTextFill, 
  BsPlayCircle, BsGraphUp, BsFillBarChartLineFill, BsFillPersonLinesFill, BsCashStack, 
  BsFillShieldLockFill
} from 'react-icons/bs';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import '../styles/admin_dashboard.css';

const Dashboard = () => {
  const data = [
    { name: 'Day 1', uv: 4000, pv: 2400 },
    { name: 'Day 2', uv: 3000, pv: 1398 },
    { name: 'Day 3', uv: 2000, pv: 9800 },
    { name: 'Day 4', uv: 2780, pv: 3908 },
    { name: 'Day 5', uv: 1890, pv: 4800 },
    { name: 'Day 6', uv: 2390, pv: 3800 },
    { name: 'Day 7', uv: 3490, pv: 4300 },
  ];

  const data_users_added = [
    { name: 'Day 1', playersAdded: 20, coachesAdded: 5 },
    { name: 'Day 2', playersAdded: 15, coachesAdded: 2 },
    { name: 'Day 3', playersAdded: 25, coachesAdded: 3 },
    { name: 'Day 4', playersAdded: 10, coachesAdded: 4 },
    { name: 'Day 5', playersAdded: 30, coachesAdded: 1 },
    { name: 'Day 6', playersAdded: 5, coachesAdded: 2 },
    { name: 'Day 7', playersAdded: 40, coachesAdded: 5 },
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD OVERVIEW</h3>
      </div>

      <div className='main-cards'>
        {/* User List */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Users</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>45 Players, 10 Coaches</h1>
        </div>

        {/* User Activity */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Games Played</h3>
            <BsFillBarChartLineFill className='card_icon' />
          </div>
          <h1>150 Games</h1>
        </div>

        {/* Content Management */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Articles & Videos</h3>
            <BsFillFileEarmarkTextFill className='card_icon' />
          </div>
          <h1>12 Articles, 5 Videos</h1>
        </div>

        {/* Analytics */}
        <div className='card'>
          <div className='card-inner'>
            <h3>User Engagement</h3>
            <BsGraphUp className='card_icon' />
          </div>
          <h1>350 Views</h1>
        </div>

        {/* Messages */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Messages</h3>
            <BsFillEnvelopeFill className='card_icon' />
          </div>
          <h1>20 Sent</h1>
        </div>

        {/* Feedback */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Feedback</h3>
            <BsFillPersonLinesFill className='card_icon' />
          </div>
          <h1>15 Ratings</h1>
        </div>

        {/* Event Management */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Tournaments</h3>
            <BsPlayCircle className='card_icon' />
          </div>
          <h1>3 Scheduled</h1>
        </div>

        {/* Financial Overview */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Subscriptions</h3>
            <BsCashStack className='card_icon' />
          </div>
          <h1>120 Active</h1>
        </div>

        {/* Security */}
        <div className='card'>
          <div className='card-inner'>
            <h3>Activity Logs</h3>
            <BsFillShieldLockFill className='card_icon' />
          </div>
          <h1>350 Events</h1>
        </div>
      </div>

      <div className='charts'>
        {/* User Engagement Chart */}
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='pv' stroke='#8884d8' />
            <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
          </LineChart>
        </ResponsiveContainer>

        {/* Game Stats Chart */}
<ResponsiveContainer width='100%' height='100%'>
  <BarChart data={data_users_added} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray='3 3' />
    <XAxis dataKey='name' />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey='playersAdded' fill='#8884d8' />
    <Bar dataKey='coachesAdded' fill='#82ca9d' />
  </BarChart>
</ResponsiveContainer>

      </div>
    </main>
  );
};

export default Dashboard;

