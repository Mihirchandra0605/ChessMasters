import React from 'react';
import './index.css'; 
import chessKing from './king.jpg'; 

// Dummy data for previous games
const previousGames = [
  { id: 1, opponent: 'Player1', result: 'Win' },
  { id: 2, opponent: 'Player2', result: 'Loss' },
  { id: 3, opponent: 'Player3', result: 'Win' },
];

// Dummy data for featured content
const featuredArticle = {
  title: 'Top 5 Strategies to Win Your Next Game',
  link: '/articles/top-5-strategies',
};

const featuredVideo = {
  title: 'Mastering Chess in 10 Minutes',
  link: '/videos/mastering-chess',
};

const IndexPage = () => {
  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="/profile" className="navLink">Profile</a>
        <a href="/coaches" className="navLink">Coaches</a>
        <a href="/articles" className="navLink">Articles </a>
        <a href="/tutorials" className="navLink">Tutorials</a>

      </nav>

      <div className="content">
        {/* Section: Start Game and Previous Games Side by Side */}
        <div className="flexContainer">
          {/* Start a Game */}
          <section className="section startGameSection">
            
            <button className="buttonWithImage">
              Start Game
            </button>
            <img src={chessKing} alt="Chess King" className="chessKingImage" />
          </section>

          {/* Previous Games */}
          <section className="section">
            <h2 className="sectionTitle">Previous Games</h2>
            <ul className="list">
              {previousGames.map((game) => (
                <li key={game.id} className="listItem">
                  <span>Opponent: {game.opponent}</span> | <span>Result: {game.result}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section: Featured Article & Video */}
        <section className="section">
          <h2 className="sectionTitle">Featured Content</h2>
          <div className="featuredContent">
            <div className="featuredItem">
              <h3>Featured Article</h3>
              <a href={featuredArticle.link} className="link">{featuredArticle.title}</a>
            </div>
            <div className="featuredItem">
              <h3>Featured Video</h3>
              <a href={featuredVideo.link} className="link">{featuredVideo.title}</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IndexPage;



