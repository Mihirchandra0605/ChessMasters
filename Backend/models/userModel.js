import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserModelSchema = new Schema({
  UserName: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Status: { type: String, default: "Active" },
  Role: { type: String, required: true, enum: ["player", "coach"] }, 
  subscribedCoaches: [{ type: Schema.Types.ObjectId, ref: "CoachDetails" }], // will remain null(empty) in the case of coach
});

UserModelSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});

export default model("UserModel", UserModelSchema);
