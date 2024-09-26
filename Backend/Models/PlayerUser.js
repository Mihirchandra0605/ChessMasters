import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const { Schema, model } = mongoose;

export const PlayerUserSchema = new Schema({
  UserName: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Level: { type: String, default: "Beginner" }, //beginner, intermediate,advanced,expert
  Status: { type: String, default: "Active" }, // Active/ offline

  SubscribedCoaches: [{ type: Schema.Types.ObjectId, ref: 'CoachUser' }]
});

// Mongoose Middleware for hashing password before saving
PlayerUserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("Password") || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.Password, salt);
      user.Password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

export const PlayerUser = model("PlayerUser", PlayerUserSchema);
