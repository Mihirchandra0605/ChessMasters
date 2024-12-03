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
    <div className="min-h-screen bg-gradient-to-br from-brown  to-black py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 text-center mb-12">
          Available Coaches
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Coachprofile />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <button
            onClick={handleBackToDashboard}
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            <span className="absolute left-0 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-4">
              <svg
                className="h-5 w-5"
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
            <span className="text-sm font-medium transition-all duration-300 ease-out group-hover:ml-4">
              Back to Home
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CoachesAvailable;