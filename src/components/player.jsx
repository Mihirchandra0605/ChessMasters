import React, { useEffect, useRef, useState } from 'react';

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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8 lg:p-12 
                    min-h-screen flex justify-center items-center">
      <div 
        ref={playerRef} 
        className={`flex flex-col md:flex-row items-center justify-center 
                   max-w-7xl mx-auto gap-6 sm:gap-8 md:gap-12 
                   transition-opacity duration-500 ease-in-out 
                   ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl 
                       text-gray-800 leading-relaxed 
                       max-w-xl mx-auto md:mx-0">
            Play against players of all skill level and improve your game. 
            Get detailed analysis after each game to know your strengths 
            and weaknesses
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="/strategy.png" 
            alt="player" 
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 
                     object-cover rounded-full shadow-lg 
                     transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
