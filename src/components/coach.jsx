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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex justify-center items-center min-h-screen">
      <div 
        ref={coachRef} 
        className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} flex flex-col items-center`}
      >
        <img 
          src="/teacher.png" 
          alt="teacher" 
          className="w-32 h-32 rounded-full shadow-lg mb-4"
        />
        <p className="text-gray-800 text-lg text-center leading-relaxed max-w-lg mx-auto">
          Get access to the best coaches available all over the world. Read their insightful articles and get access to their tutorials. Book a one-on-one session for an ever more personalised learning
        </p>
      </div>
    </div>
  );
}

export default Coach;