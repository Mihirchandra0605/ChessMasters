import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import { 
  ChevronLeft, 
  AlertTriangle, 
  Minimize2, 
  RefreshCw, 
  Trophy, 
  ArrowRight, 
  Handshake, 
  X, 
  Award, 
  Scale,
  Puzzle,
  Shuffle
} from "lucide-react";
import axios from "axios";
import { mihirBackend } from "../../config.js";



const Rules = () => {
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  const [details, setDetails] = React.useState(null);

  useEffect(() => {
    axios
      .get(`${mihirBackend}/auth/details`, { withCredentials: true })
      .then((resp) => {
        setDetails(resp.data);
      })
      .catch((err) => {
        console.error("Error fetching details:", err);
      });
  }, []);

  const handleBack = () => {
    if (role === 'player') {
      navigate('/Index?role=player');
    } else {
      navigate('/Index');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8 overflow-hidden"
    >
      <motion.button
        onClick={handleBack}
        className="fixed top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                   py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </motion.button>

      <motion.div
        className="max-w-5xl mx-auto mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Chess Game Rules
          </motion.h1>
          <p className="text-blue-200 text-lg max-w-3xl mx-auto">
            Understand the gameplay mechanics and special considerations before starting a match
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-300" size={24} />
            <h2 className="text-2xl font-bold text-red-300">Important Notice</h2>
          </div>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-start gap-2">
              <div className="mt-1 text-red-300"><Minimize2 size={18} /></div>
              <p>The chess game will run in <span className="font-semibold">full-screen mode</span>.</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 text-red-300"><RefreshCw size={18} /></div>
              <p>If a player <span className="font-semibold">refreshes or minimizes</span> the screen, it will count as <span className="text-red-300 font-semibold">resignation</span>, and the opponent will automatically be declared the winner.</p>
            </li>
          </ul>
        </motion.div>

        {/* Piece Movement */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Puzzle className="text-blue-300" size={24} />
            <h2 className="text-2xl font-bold text-blue-300">Piece Movement</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♔</span>
                <h3 className="font-bold text-purple-300">King</h3>
              </div>
              <p className="text-sm text-white/80">Moves one square in any direction.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♕</span>
                <h3 className="font-bold text-purple-300">Queen</h3>
              </div>
              <p className="text-sm text-white/80">Moves any number of squares in any direction.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♖</span>
                <h3 className="font-bold text-purple-300">Rook</h3>
              </div>
              <p className="text-sm text-white/80">Moves any number of squares vertically or horizontally.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♗</span>
                <h3 className="font-bold text-purple-300">Bishop</h3>
              </div>
              <p className="text-sm text-white/80">Moves any number of squares diagonally.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♘</span>
                <h3 className="font-bold text-purple-300">Knight</h3>
              </div>
              <p className="text-sm text-white/80">Moves in an 'L' shape (two squares in one direction, then one square perpendicular).</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-purple-300 text-2xl">♙</span>
                <h3 className="font-bold text-purple-300">Pawn</h3>
              </div>
              <p className="text-sm text-white/80">Moves forward one square; two squares from its starting position. Captures diagonally.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Special Rules */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-indigo-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shuffle className="text-indigo-300" size={24} />
            <h2 className="text-2xl font-bold text-indigo-300">Special Rules</h2>
          </div>
          
          <div className="space-y-6">
            {/* Castling */}
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <h3 className="font-bold text-purple-300 text-lg mb-2">Castling</h3>
              <p className="text-white/80 mb-2">
                A special move where the king and rook move simultaneously.
              </p>
              <p className="text-sm text-white/70">Conditions:</p>
              <ul className="list-disc list-inside text-sm text-white/70 ml-2 space-y-1">
                <li>Neither the king nor the rook has moved before.</li>
                <li>No pieces between the king and rook.</li>
                <li>The king is not in check, does not pass through check, and does not end up in check.</li>
              </ul>
            </div>
            
            {/* Pawn Promotion */}
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <h3 className="font-bold text-purple-300 text-lg mb-2">Pawn Promotion</h3>
              <div className="flex items-center gap-2">
                <span className="text-white/70 text-lg">♙</span>
                <ArrowRight className="text-white/50" size={14} />
                <span className="text-white/70 text-lg">♕</span>
                <p className="text-white/80">
                  When a pawn reaches the last rank, it is promoted to a queen.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Draw Conditions */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Scale className="text-cyan-300" size={24} />
            <h2 className="text-2xl font-bold text-cyan-300">Draw Conditions (No ELO Change)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <h3 className="font-bold text-blue-200 mb-2">Insufficient Material</h3>
              <p className="text-sm text-white/80">
                When neither player has enough pieces to deliver checkmate (e.g., King vs King).
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <h3 className="font-bold text-blue-200 mb-2">Threefold Repetition</h3>
              <p className="text-sm text-white/80">
                The same position appears three times with the same player to move.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <h3 className="font-bold text-blue-200 mb-2">Stalemate</h3>
              <p className="text-sm text-white/80">
                The player to move has no legal moves, and the king is not in check.
              </p>
            </motion.div>
          </div>
          
          {/* Draw by Agreement */}
          <motion.div 
            className="mt-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="text-blue-200" size={20} />
              <h3 className="font-bold text-blue-200">Draw by Agreement</h3>
            </div>
            <p className="text-white/80">
              A 'Draw' button is available. If both players agree, the game ends in a draw with no ELO change.
            </p>
          </motion.div>
        </motion.div>

        {/* Game Results */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-500/30 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-purple-300" size={24} />
            <h2 className="text-2xl font-bold text-purple-300">Game Results</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 rounded-xl border border-emerald-500/30 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-emerald-300 text-2xl">♔</span>
                <h3 className="font-bold text-emerald-300">Checkmate</h3>
              </div>
              <p className="text-white/80 mb-2">
                The player delivering checkmate wins.
              </p>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg mt-2">
                <Award className="text-yellow-300" size={18} />
                <p className="text-white font-medium">
                  Winner gains <span className="text-green-300">+100 ELO</span>
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg mt-2">
                <X className="text-red-300" size={18} />
                <p className="text-white font-medium">
                  Loser loses <span className="text-red-300">-100 ELO</span>
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <X className="text-red-300" size={20} />
                <h3 className="font-bold text-red-300">Resignation</h3>
              </div>
              <p className="text-white/80 mb-2">
                A player can resign at any time. It counts as a loss for the resigning player, and the opponent is declared the winner.
              </p>
              <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/30 mt-2">
                <p className="text-white/90 text-sm">
                  <span className="text-red-300 font-semibold">Note:</span> Refreshing or minimizing the game window counts as resignation.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Caution Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-12 border-2 border-red-500/50 shadow-xl"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <AlertTriangle className="text-red-300" size={36} />
            <h2 className="text-xl md:text-2xl font-bold text-red-300">
              Any refresh or minimize action will be treated as resignation and result in a loss.
            </h2>
          </div>
        </motion.div>

        {/* Back Button for mobile (fixed at bottom) */}
        <motion.div
          variants={itemVariants}
          className="fixed bottom-6 left-0 right-0 flex justify-center md:hidden"
        >
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                      py-2 px-6 rounded-full shadow-lg text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={18} />
            <span>Back to Home</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Rules; 