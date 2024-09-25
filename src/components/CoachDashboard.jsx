import React from 'react';
import '../styles/CoachDashboard.css';
import SubscriptionChart from './subscription.jsx';
import Viewchart from './views.jsx';
import EarningsChart from './earnings.jsx';
import {Link} from 'react-router-dom'

const CoachDashboard = () => {

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>John Doe - Coach Dashboard</h1>
            </header>
            
            <div className='dashboard'>
            <nav className="dashboard-nav">
                {/* <button>Students</button>
                <button>Videos</button>
                <button>Articles</button> */}
                <Link to="/Upload"><button>Add</button></Link>
                <Link to="/Index"><button>Home</button></Link>
            </nav>

            <div className='charts-main'>
            <div className="charts-container">
                <SubscriptionChart />
                <Viewchart />
                <EarningsChart />
            </div>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Students</h2>
                    <ul className="students-list">
                        <li>Student1 (Rating: 2000)</li>
                        <li>Student2 (Rating: 2100)</li>
                        <li>Student3 (Rating: 2200)</li>
                    </ul>
                </section>

                <section className="dashboard-section">
                    <h2>Lecture Videos</h2>
                    <ul className="videos-list">
                        <li><a href="#">Video 1: Opening Strategies</a></li>
                        <li><a href="#">Video 2: Mid-Game Tactics</a></li>
                        <li><a href="#">Video 3: Endgame Techniques</a></li>
                    </ul>
                </section>

                <section className="dashboard-section">
                    <h2>Articles</h2>
                    <ul className="articles-list">
                        <li><a href="#">Article 1: How to Improve Your Chess Rating</a></li>
                        <li><a href="#">Article 2: Analyzing Famous Chess Games</a></li>
                        <li><a href="#">Article 3: Training Regimen for Aspiring Grandmasters</a></li>
                    </ul>
                </section>
            </main>
            </div>
            </div>
        </div>
    );
};

export default CoachDashboard;
