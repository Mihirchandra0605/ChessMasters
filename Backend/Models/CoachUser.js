import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const { Schema, model } = mongoose;

//every coach is a player but every player is not a coach!

export const CoachUserSchema = new Schema({
  UserName: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Level: { type: String, default: "Beginner" }, //beginner, intermediate,advanced,expert
  Fide_id: { type: String, required: true, unique: true },
  Status: { type: String, default: "Active" },
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
