import React from "react";
import Coachprofile from "./Coachprofile";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CoachesAvailable = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/Index?role=player");
  };

  return (
    <div className="min-h-screen bg-[#E0F4FF] 
                    py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12
                    relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E0F4FF] via-[#B9E9FC] to-[#87CBB9] 
                      opacity-90"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#B9E9FC]
                      rounded-full mix-blend-multiply filter blur-xl opacity-40 
                      animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#569DAA]
                      rounded-full mix-blend-multiply filter blur-xl opacity-40 
                      animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#87CBB9]
                      rounded-full mix-blend-multiply filter blur-xl opacity-40 
                      animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                       font-extrabold text-[#2D4356]
                       text-center mb-8 sm:mb-12 md:mb-16
                       leading-tight sm:leading-tight md:leading-tight
                       filter drop-shadow-lg">
          Available Coaches
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full backdrop-blur-sm bg-[#E0F4FF]/90
                     rounded-2xl p-6 shadow-lg ring-1 ring-[#569DAA]/30 
                     hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-[#2D4356]">
            <Coachprofile />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 sm:mt-16 md:mt-20 flex justify-center"
        >
          <button
            onClick={handleBackToDashboard}
            className="group relative inline-flex items-center overflow-hidden 
                     rounded-full bg-gradient-to-r from-[#2D4356] to-[#569DAA]
                     px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-[#E0F4FF]
                     shadow-lg hover:shadow-2xl
                     transition-all duration-300 ease-out hover:scale-105 
                     focus:outline-none focus:ring-2 focus:ring-[#569DAA]
                     focus:ring-offset-2 transform hover:-translate-y-1"
          >
            <span className="absolute right-0 translate-x-full transition-transform 
                           duration-300 ease-out group-hover:-translate-x-4">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            <span className="text-base sm:text-lg md:text-xl font-medium 
                           transition-all duration-300 ease-out group-hover:mr-4
                           whitespace-nowrap">
              Back to Home
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CoachesAvailable;
