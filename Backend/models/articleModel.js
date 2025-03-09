import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ArticleSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "CoachDetails", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  filePath: { type: String, required: true },  // New field for file path
  createdAt: { type: Date, default: Date.now },
});

export default model("Article", ArticleSchema);
