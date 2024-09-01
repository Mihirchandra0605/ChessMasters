import React from 'react';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>User Profile</h1>
            </header>
            <nav className="dashboard-nav">
                <ul>
                    <li>Profile</li>
                    <li>Games</li>
                    <li>Statistics</li>
                    <li>Settings</li>
                </ul>
            </nav>
            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <p><strong>Username:</strong> ChessMaster123</p>
                        <p><strong>Rating:</strong> 1850</p>
                        <p><strong>Country:</strong> United States</p>
                    </div>
                </section>
                <section className="dashboard-section">
                    <h2>Recent Games</h2>
                    <ul className="recent-games">
                        <li>Win vs. TheKing (ELO: 1780)</li>
                        <li>Loss vs. QueenBee (ELO: 1900)</li>
                        <li>Draw vs. KnightRider (ELO: 1830)</li>
                    </ul>
                </section>
                <section className="dashboard-section">
                    <h2>Statistics</h2>
                    <div className="stats">
                        <p><strong>Total Games:</strong> 120</p>
                        <p><strong>Wins:</strong> 75</p>
                        <p><strong>Losses:</strong> 30</p>
                        <p><strong>Draws:</strong> 15</p>
                    </div>
                </section>
            </main>
            <footer className="dashboard-footer">
                <p>Chess Website © 2024</p>
            </footer>
        </div>
    );
};

export default UserDashboard;