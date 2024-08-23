import React from 'react';
import '../styles/CoachDashboard.css';

const CoachDashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Coach Profile</h1>
            </header>
            <nav className="dashboard-nav">
                <ul>
                    <li>Profile</li>
                    <li>Achievements</li>
                    <li>Students</li>
                    <li>Videos</li>
                    <li>Articles</li>
                </ul>
            </nav>
            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <p><strong>Name:</strong> Coach John Doe</p>
                        <p><strong>Rating:</strong> 2400</p>
                        <p><strong>Country:</strong> United States</p>
                    </div>
                </section>
                <section className="dashboard-section">
                    <h2>Achievements</h2>
                    <ul className="achievements-list">
                        <li>National Chess Champion 2018</li>
                        <li>International Grandmaster Title 2016</li>
                        <li>Coach of the Year 2020</li>
                    </ul>
                </section>
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
            <footer className="dashboard-footer">
                <p>Chess Website © 2024</p>
            </footer>
        </div>
    );
};

export default CoachDashboard;