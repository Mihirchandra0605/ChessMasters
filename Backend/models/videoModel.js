import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ViewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  viewedAt: { type: Date, default: Date.now }
});

const VideoSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "CoachDetails", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, 
  filePath: { type: String, required: true }, 
  thumbnailPath: { type: String, default: "" }, 
  createdAt: { type: Date, default: Date.now },
  views: [ViewSchema]
});

export default model("Video", VideoSchema);
