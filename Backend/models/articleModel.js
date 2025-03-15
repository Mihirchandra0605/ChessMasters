import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ViewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  viewedAt: { type: Date, default: Date.now }
});

const ArticleSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "CoachDetails", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  filePath: { type: String, required: true },  // New field for file path
  createdAt: { type: Date, default: Date.now },
  views: [ViewSchema]
});

export default model("Article", ArticleSchema);
