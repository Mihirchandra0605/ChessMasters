import React, { useEffect, useRef, useState } from 'react';

function Coach() {
  const coachRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    });

    if (coachRef.current) {
      observer.observe(coachRef.current);
    }

    return () => {
      if (coachRef.current) {
        observer.unobserve(coachRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 
                    p-4 sm:p-6 md:p-8 lg:p-12 
                    flex justify-center items-center min-h-screen">
      <div 
        ref={coachRef} 
        className={`transition-opacity duration-500 ease-in-out 
                    ${isVisible ? 'opacity-100' : 'opacity-0'} 
                    flex flex-col items-center 
                    w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
                    mx-auto px-4 sm:px-6 md:px-8`}
      >
        <img 
          src="/teacher.png" 
          alt="teacher" 
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                     rounded-full shadow-lg mb-4 sm:mb-6 md:mb-8 
                     transform hover:scale-105 transition-transform duration-300
                     border-4 border-white"
        />
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl 
                      text-gray-800 text-center leading-relaxed 
                      max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 
                      mx-auto font-medium">
          Get access to the best coaches available all over the world. 
          Read their insightful articles and get access to their tutorials. 
          Book a one-on-one session for an ever more personalised learning
        </p>
      </div>
    </div>
  );
}

export default Coach;
