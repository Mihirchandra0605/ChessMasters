import React, { useState } from "react";
import { motion } from "framer-motion";

function SignupForm() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("");
  const [fideId, setFideId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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

    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#16213E] shadow-lg rounded-xl p-6 w-full"
    >
      <div className="flex justify-center items-center space-x-4 mb-4">
        <motion.img
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
        <h1 className="text-xl font-bold text-[#E4EfE9]">Sign Up</h1>
        <motion.img
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6"
          src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
          alt="rook"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select
          className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            UserType
          </option>
          <option value="player">Player</option>
          <option value="coach">Coach</option>
        </select>
        {role === "coach" && (
          <input
            type="text"
            placeholder="FIDE ID"
            className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
            value={fideId}
            onChange={(e) => setFideId(e.target.value)}
            required
          />
        )}
        {role === "player" && (
          <select
            className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 bg-[#1A1A2E] text-[#E4EfE9] border border-[#29011C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FBB03B] transition-all duration-300"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <motion.button
          type="submit"
          className="w-full px-4 py-2 bg-[#FBB03B] text-[#010332] font-semibold rounded-lg hover:bg-[#FCEE21] transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>
      </form>
    </motion.div>
  );
}

export default SignupForm;