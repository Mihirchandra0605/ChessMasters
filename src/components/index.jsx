import React, { useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/index.css";
import Navbar from "./Navbar.jsx";
import NavbarPlay from "./navbarplay.jsx"; // Assuming you have a separate Navbar component for players

function HomePage() {
  const navigate = useNavigate();

  const handlePlayNowClick = () => {
    navigate('/ChessBoard');
  };

  const [role] = useSearchParams();
  console.log('role', role.get('role'));
  const [isPlayer, setIsPlayer] = useState(role.get('role') === 'player' ? true : false); // Update the state based on the user's role

  // Refs to access DOM elements
  const gameScrollContainerRef = useRef(null);
  const scrollLeftRef = useRef(null);
  const scrollRightRef = useRef(null);

  const videoScrollContainerRef = useRef(null);
  const videoScrollLeftRef = useRef(null);
  const videoScrollRightRef = useRef(null);

  const articleScrollContainerRef = useRef(null);
  const articleScrollLeftRef = useRef(null);
  const articleScrollRightRef = useRef(null);

  // Effect to add event listeners
  useEffect(() => {
    const setupScroll = (scrollContainer, scrollLeftButton, scrollRightButton) => {
      const scrollLeft = () => {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: -100, behavior: "smooth" });
        }
      };

      const scrollRight = () => {
        if (scrollContainer) {
          scrollContainer.scrollBy({ left: 100, behavior: "smooth" });
        }
      };

      // Attach event listeners
      if (scrollLeftButton) {
        scrollLeftButton.addEventListener("click", scrollLeft);
      }
      if (scrollRightButton) {
        scrollRightButton.addEventListener("click", scrollRight);
      }

      // Cleanup function to remove event listeners
      return () => {
        if (scrollLeftButton) {
          scrollLeftButton.removeEventListener("click", scrollLeft);
        }
        if (scrollRightButton) {
          scrollRightButton.removeEventListener("click", scrollRight);
        }
      };
    };

    const gameCleanup = setupScroll(
      gameScrollContainerRef.current,
      scrollLeftRef.current,
      scrollRightRef.current
    );

    const videoCleanup = setupScroll(
      videoScrollContainerRef.current,
      videoScrollLeftRef.current,
      videoScrollRightRef.current
    );

    const articleCleanup = setupScroll(
      articleScrollContainerRef.current,
      articleScrollLeftRef.current,
      articleScrollRightRef.current
    );

    // Combine all cleanups into one cleanup function
    return () => {
      gameCleanup();
      videoCleanup();
      articleCleanup();
    };
  }, []);

  return (
    <div id="Home">
      {/* Conditionally render the appropriate navbar based on the user's role */}
      {isPlayer ? <NavbarPlay /> : <Navbar />}

      <div id="content">
        <div className="section_content">
          <h1 className="heading">Welcome back, UserName!</h1>
          <button id="play_button" onClick={handlePlayNowClick}>Play Now!</button>
        </div>

        <div className="section_content">
          <h2 className="heading">Stats</h2>
          <div id="stat_box">
            <div className="stat">
              <p>Games Played: 100</p>
              <p>Wins: 80</p>
              <p>Losses: 20</p>
              <p>Rating: 1300</p>
            </div>
          </div>
        </div>

        {/* Games Carousel */}
        <div className="section_content" id="carousel">
          <h2 className="heading">Your Games :-</h2>
          <div id="game_box">
            <img
              src="/public/back.png"
              alt="Scroll Left"
              id="scrollLeft"
              ref={scrollLeftRef}
            />
            <div className="game_scroll_container" ref={gameScrollContainerRef}>
              <div className="game">Game 1</div>
              <div className="game">Game 2</div>
              <div className="game">Game 3</div>
              <div className="game">Game 4</div>
              <div className="game">Game 5</div>
            </div>
            <img
              src="/public/next.png"
              alt="Scroll Right"
              id="scrollRight"
              ref={scrollRightRef}
            />
          </div>
        </div>

        {/* Videos Carousel */}
        <div className="section_content" id="carousel">
          <h2 className="heading">Featured Videos :-</h2>
          <div id="game_box">
            <img
              src="/public/back.png"
              alt="Scroll Left"
              id="scrollLeft"
              ref={videoScrollLeftRef}
            />
            <div className="game_scroll_container" ref={videoScrollContainerRef}>
              <div className="game">Video 1</div>
              <div className="game">Video 2</div>
              <div className="game">Video 3</div>
            </div>
            <img
              src="/public/next.png"
              alt="Scroll Right"
              id="scrollRight"
              ref={videoScrollRightRef}
            />
          </div>
        </div>

        {/* Articles Carousel */}
        <div className="section_content" id="carousel">
          <h2 className="heading">Featured Articles :-</h2>
          <div id="game_box">
            <img
              src="/public/back.png"
              alt="Scroll Left"
              id="scrollLeft"
              ref={articleScrollLeftRef}
            />
            <div className="game_scroll_container" ref={articleScrollContainerRef}>
              <div className="game">Article 1</div>
              <div className="game">Article 2</div>
              <div className="game">Article 3</div>
            </div>
            <img
              src="/public/next.png"
              alt="Scroll Right"
              id="scrollRight"
              ref={articleScrollRightRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;