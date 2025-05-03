import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { mihirBackend } from "../../config.js";

function AlertMessage({ message, duration = 3000 }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ['100%', '0%', '0%', '-100%'],
      transition: { duration: duration / 1000, times: [0, 0.1, 0.9, 1] }
    });
  }, [controls, duration]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={controls}
      className="fixed top-4 right-4 bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg text-sm sm:text-base z-50"
    >
      <div className="flex items-center">
        <span>{message}</span>
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000 }}
          className="h-1 bg-green-300 mt-2"
        />
      </div>
    </motion.div>
  );
}

function SignupForm({ onSignupSuccess }) {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("");
  const [fideId, setFideId] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);
  const isValidPassword = (pwd) => pwd.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAlphanumeric(username)) {
      alert("Username must contain only alphanumeric characters");
      return;
    }

    if (!isValidPassword(password)) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      UserName: username,
      Email: email,
      Password: password,
      Role: role,
      Status: "Active",
      ...(role === "player" && { Level: level }),
      ...(role === "coach" && { Fide_id: fideId }),
    };

    fetch(`${mihirBackend}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          onSignupSuccess();
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred during signup. Please try again.");
      });
  };

  const inputClasses = "w-full p-2 sm:p-2.5 md:p-3 text-sm sm:text-base bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300";

  return (
    <>
      {showAlert && <AlertMessage message="Signup successful!" />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#16213E] shadow-lg rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-md mx-auto"
      >
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4 md:mb-6">
          <motion.img
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
            alt="rook"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#E4EfE9]">Sign Up</h1>
          <motion.img
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
            alt="rook"
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
          <input
            type="text"
            placeholder="Username"
            className={inputClasses}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <select
            className={inputClasses}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled hidden>UserType</option>
            <option value="player">Player</option>
            <option value="coach">Coach</option>
          </select>
          {role === "coach" && (
            <input
              type="text"
              placeholder="FIDE ID"
              className={inputClasses}
              value={fideId}
              onChange={(e) => setFideId(e.target.value)}
              required
            />
          )}
          {role === "player" && (
            <select
              className={inputClasses}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="" disabled hidden>Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          )}
          <input
            type="email"
            placeholder="Email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={inputClasses}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <motion.button
            type="submit"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base bg-[#FBB03B] text-[#010332] font-semibold rounded-lg hover:bg-[#FCEE21] transition-all duration-300 mt-2 sm:mt-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </form>
      </motion.div>
    </>
  );
}

export default SignupForm;

