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
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-cyan-800 py-20 px-6 sm:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-9xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 text-center mb-16">
          Available Coaches
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Coachprofile />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <button
            onClick={handleBackToDashboard}
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 text-white shadow-xl transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          >
            <span className="absolute left-0 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-4">
              <svg
                className="h-6 w-6"
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
            <span className="text-xl font-medium transition-all duration-300 ease-out group-hover:ml-4">
              Back to Home
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CoachesAvailable;