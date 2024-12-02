import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import SlideShow from "./SlideShow";
import Footer from "./footer"

function Greeting({ onLoginSuccess }) {
  const [view, setView] = useState("greeting");

  useEffect(() => {
    if (view === "login" || view === "signup") {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [view]);

  const handleLoginClick = () => setView("login");
  const handleSignupClick = () => setView("signup");
  const handleHomeClick = () => setView("greeting");

  return (
    <div className="flex flex-col min-h-screen">
    <div className="flex h-screen">
      <div className="w-1/2 h-full bg-gradient-to-br from-[#023020] to-[#0B6623] p-8 flex flex-col justify-center">
        {view === "greeting" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <div className="flex justify-center items-center space-x-4">
              <motion.img
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12"
                src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
                alt="rook"
              />
              <h1 className="text-4xl font-bold text-[#E4EfE9]">Welcome to ChessMasters</h1>
              <motion.img
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12"
                src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
                alt="rook"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                onClick={handleLoginClick}
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                onClick={handleSignupClick}
              >
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}
        {view === "login" && (
          <div className="flex flex-col items-center">
            <LoginForm onLoginSuccess={onLoginSuccess} />
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                onClick={handleHomeClick}
              >
                Home
              </button>
              <button
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                onClick={handleSignupClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
        {view === "signup" && (
          <div className="flex flex-col items-center justify-between h-full py-4">
            <div className="w-full max-w-md">
              <SignupForm />
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                onClick={handleHomeClick}
              >
                Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                onClick={handleLoginClick}
              >
                Log In
              </motion.button>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2 h-screen">
        <SlideShow />
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Greeting;
