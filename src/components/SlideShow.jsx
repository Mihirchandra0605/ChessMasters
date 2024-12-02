import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { image: '/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png', text: 'Master chess strategies' },
  { image: '/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png', text: 'Play with global opponents' },
  { image: '/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png', text: 'Track your progress' },
  { image: '/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png', text: 'Join tournaments' },
];

function SlideShow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full bg-gradient-to-bl from-[#29011C] to-[#010332] p-4 flex items-center justify-center">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-[#1A1A2E] rounded-xl shadow-2xl overflow-hidden w-full h-full flex flex-col"
        >
          <div className="flex-grow p-6 flex flex-col justify-center">
            <div className="w-full h-1/2 flex items-center justify-center mb-6">
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg border-4 border-[#E4EfE9] shadow-md"
              />
            </div>
            <div className="bg-[#16213E] p-6 rounded-lg flex flex-col justify-center flex-grow shadow-inner">
              <h2 className="text-[#E4EfE9] text-2xl font-bold text-center mb-4">
                {slides[currentSlide].text}
              </h2>
              <p className="text-[#B2B2B2] text-base leading-relaxed text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SlideShow;
