import mongoose from "mongoose";

const { Schema, model } = mongoose;

// This schema references the UserModel
const CoachDetailsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
  Fide_id: { type: String, unique: true },
  quote: { type: String, default: "" },
  location: { type: String, default: "" },
  languages: { type: [String], default: [] },
  rating: { type: Number, default: null },
  playingExperience: { type: String, default: "" },
  teachingExperience: { type: String, default: "" },
  hourlyRate: { type: Number, default: null },
  aboutMe: { type: String, default: "" },
  teachingMethodology: { type: String, default: "" },
  revenue: { type: Number, default: 0 },
  subscribers: [
    {
      user: { type: Schema.Types.ObjectId, ref: "UserModel" },
      subscribedAt: { type: Date, default: Date.now }, // Store subscription date here
    },
  ],
});

export default model("CoachDetails", CoachDetailsSchema);