import mongoose from "mongoose";

const { Schema, model } = mongoose;

const VideoSchema = new Schema({
  coach: { type: Schema.Types.ObjectId, ref: "CoachDetails", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, 
  filePath: { type: String, required: true }, 
  thumbnailPath: { type: String, default: "" }, 
  createdAt: { type: Date, default: Date.now }, 
});

export default model("Video", VideoSchema);
