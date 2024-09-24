import React, { useEffect, useRef, useState } from 'react';
import "../styles/coach.css";

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
    <div ref={coachRef} id="coach" className={isVisible ? 'coach-visible' : ''}>
      <img id="teacher" src="/teacher.png" alt="teacher" />
      <p id="coachMessage">Get access to the best coaches available all over the world. Read their insightful articles and get access to their tutorials. Book a one-on-one session for an ever more personalised learning</p>
    </div>
  );
}

export default Coach;