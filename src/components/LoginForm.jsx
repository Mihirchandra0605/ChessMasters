import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { mihirBackend } from "../../config.js";


function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`${mihirBackend}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      const decodedToken = jwtDecode(data.token);
      const userId = decodedToken.userId;
      const role = data.userType || data.role;

      dispatch(setUser({ userId, role }));
      onLoginSuccess();

      if (role === "admin") navigate("/AdminDashboard");
      else if (role === "player") navigate(`/player/${userId}/profile`);
      else if (role === "coach") navigate(`/coach/${userId}/CoachDashboard?role=coach`);
    } catch (err) {
      alert(err.message || "Login failed");
      console.error("Login error:", err);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#16213E] shadow-lg rounded-xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-auto"
    >
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
        <motion.img
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 sm:w-8 sm:h-8"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#E4EfE9]">Login</h1>
        <motion.img
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 sm:w-8 sm:h-8"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 sm:p-3 text-sm sm:text-base bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1BFFFF] transition-all duration-300"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 sm:p-3 text-sm sm:text-base bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1BFFFF] transition-all duration-300"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </motion.div>
        <motion.button
          type="submit"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#1BFFFF] text-[#010332] font-semibold rounded-lg hover:bg-[#00CDAC] transition-all duration-300"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default LoginForm;
