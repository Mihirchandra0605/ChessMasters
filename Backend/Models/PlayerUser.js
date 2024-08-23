import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const PlayerUserSchema = new Schema({
  PlayerName: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Level: { type: String, default: "Beginner" },
  Status: { type: String, default: "Active" },
});

export const PlayerUser = model("PlayerUser", PlayerUserSchema);
