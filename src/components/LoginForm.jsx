import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authResponse, setAuthResponse] = useState(null); // Store the API response
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage submit state
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Trigger the API call in useEffect
  };

  useEffect(() => {
    // Only trigger the API call when isSubmitting is true
    if (isSubmitting) {
      const login = async () => {
        try {
          const response = await fetch("http://localhost:3000/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();
          setAuthResponse({ data, ok: response.ok });
        } catch (error) {
          console.error("Error during sign-in:", error);
          setAuthResponse({ data: null, ok: false, error });
        } finally {
          setIsSubmitting(false); // Reset submission state
        }
      };

      login();
    }
  }, [isSubmitting, username, password]);

  useEffect(() => {
    if (authResponse) {
      const { data, ok } = authResponse;

      if (ok) {
        onLoginSuccess(); // Notify App that login is successful
        const role = data.userType || data.role; // Ensure proper role field is used

        if (role === "admin") {
          navigate("/AdminDashboard");
        } else if (role === "player") {
          navigate("/PlayerDashboard?role=player");
        } else if (role === "coach") {
          navigate("/CoachDashboard?role=coach");
        }
      } else {
        alert(data?.message || "Login failed"); // Display error message
      }
    }
  }, [authResponse, onLoginSuccess, navigate]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#16213E] shadow-lg rounded-xl p-8 max-w-md w-full mx-auto"
    >
      <div className="flex justify-center items-center space-x-4 mb-6">
        <motion.img
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
        <h1 className="text-3xl font-bold text-[#E4EfE9]">Login</h1>
        <motion.img
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1BFFFF] transition-all duration-300"
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
        >
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1BFFFF] transition-all duration-300"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </motion.div>
        <motion.button
          type="submit"
          className="w-full px-4 py-3 bg-[#1BFFFF] text-[#010332] font-semibold rounded-lg hover:bg-[#00CDAC] transition-all duration-300"
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
