import React, { useEffect, useState } from 'react';
import '../styles/CoachDashboard.css';
import SubscriptionChart from './subscription.jsx';
import Viewchart from './views.jsx';
import EarningsChart from './earnings.jsx';
import { Link } from 'react-router-dom';

const CoachDashboard = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch the articles from the backend when the component mounts
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/coach/getArticles', {
          method: 'GET',
          credentials: 'include', // Ensure the cookies (for session) are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setArticles(data); // Set the articles state with the fetched data
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>John Doe - Coach Dashboard</h1>
      </header>

      <div className="dashboard">
        <nav className="dashboard-nav">
          <Link to="/Upload"><button>Add</button></Link>
          <Link to="/Index"><button>Home</button></Link>
          <Link to="/AddData"><button>Complete Profile</button></Link>
        </nav>

        <div className="charts-main">
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
                 {articles.length > 0 ? (
                    articles.map((article) => (
                 <li key={article._id}>
                <Link to={`/article/${article._id}`}>{article.title}</Link> {/* Link to article detail page */}
            </li>
            ))
             ) : (
                <li>No articles available</li>
            )}
                </ul>
            </section>


          </main>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
