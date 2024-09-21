import React, { useEffect, useRef, useState } from 'react';
import "../styles/player.css";

function Player() {
  const playerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    });

    if (playerRef.current) {
      observer.observe(playerRef.current);
    }

    return () => {
      if (playerRef.current) {
        observer.unobserve(playerRef.current);
      }
    };
  }, []);

  return (
    <div ref={playerRef} id="player" className={isVisible ? 'player-visible' : ''}>
      <p id="playerMessage">Play against players of all skill level and improve your game. Get detailed analysis after each game to know your strengths and weaknesses</p>
      <img id="player_img" src="/strategy.png" alt="player" />
    </div>
  );
}

export default Player;