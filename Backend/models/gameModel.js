import mongoose from "mongoose";

const { Schema, model } = mongoose;

const GameSchema = new Schema({
  playerWhite: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  playerBlack: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  moves: {
    whiteMoves: { type: [String], default: [] },
    blackMoves: { type: [String], default: [] },
  },
  winner: { type: String, enum: ["White", "Black", "Draw"], required: true },
  datePlayed: { type: Date, default: Date.now },
  additionalAttributes: {
    duration: { type: Number },
    rating: { type: Number },
    notes: { type: String },
  },
});

export default model("Game", GameSchema);
