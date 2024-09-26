import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const { Schema, model } = mongoose;

//every coach is a player but every player is not a coach!

export const CoachUserSchema = new Schema({
  UserName: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  // Level: { type: String, default: "Beginner" }, //beginner, intermediate,advanced,expert
  Fide_id: { type: String, required: true, unique: true },
  Status: { type: String, default: "Active" },

  //coach's personal info which he will update later after creating his profile(initially, the values will be empty)
  Quote: { type: String }, 
  Location: { type: String },
  Languages: { type: [String] }, // Array of languages
  Rating: { type: Number }, 
  PlayingExperience: { type: String }, 
  TeachingExperience: { type: String }, 
  HourlyRate: { type: Number }, 

  // Subscriptions
  SubscribedPlayers: [{ type: Schema.Types.ObjectId, ref: 'PlayerUser' }]
});

CoachUserSchema.pre("save", async function (next) {
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

export const CoachUser = model("CoachUser", CoachUserSchema);
