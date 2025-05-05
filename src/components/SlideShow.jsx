import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { image: '/vishy.jpg', text: 'Vishwanath Anand', quote:'"In chess, knowledge is a very transient thing. It changes so fast that even a single mouse-slip sometimes changes the evaluation."'},
  { image: '/Hikaru.jpg', text: 'Hikaru Nakamura', quote: '"In chess, you try to do your best, but there are instances where you make mistakes or take risks that you shouldn\'t. Losing games is a good thing because you learn more from losses than wins."'},
  { image: '/carl.jpg', text: 'Magnus Carlsen', quote: '"You need to have that edge, you need to have that confidence, you need to have that absolute belief that you’re – you’re the best and you’ll win every time."'},
  { image: '/Vidit.jpg', text: 'Vidit Gujrathi', quote: '“Chess is war over the board. The object is to crush the opponent’s mind.”'},
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
    <div className="h-full w-full bg-gradient-to-bl from-[#29011C] to-[#010332] p-2 sm:p-3 md:p-4 flex items-center justify-center">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-[#1A1A2E] rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl overflow-hidden w-full h-full flex flex-col"
        >
          <div className="flex-grow p-3 sm:p-4 md:p-6 flex flex-col justify-center">
            <div className="w-full h-1/2 flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                className="max-w-full max-h-full object-contain rounded-md sm:rounded-lg border-2 sm:border-4 border-[#E4EfE9] shadow-md"
              />
            </div>
            <div className="bg-[#16213E] p-3 sm:p-4 md:p-6 rounded-md sm:rounded-lg flex flex-col justify-center flex-grow shadow-inner">
              <h2 className="text-[#E4EfE9] text-lg sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-3 md:mb-4">
                {slides[currentSlide].text}
              </h2>
              <p className="text-white italic font-bold text-sm sm:text-base md:text-xl leading-relaxed text-center px-2 sm:px-4">
                {slides[currentSlide].quote}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SlideShow;


