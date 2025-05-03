import { config } from "dotenv";

// Load environment variables from .env file
config();

// Destructure environment variables
const {
  JWT_SECRET_KEY,
  PORT,
  FRONTEND_URL,
  MONGODB_URI,
  MIHIR_BACKEND,
} = process.env;

// Validate required variables
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY environment variable is not set!");
}

export const jwtSecretKey = JWT_SECRET_KEY;
export const port = PORT || 3000; // default fallback
export const frontendUrl = FRONTEND_URL || "http://localhost:5173";
export const mongodbUri = MONGODB_URI || "mongodb://localhost:27017/chessmasters"; // default fallback
export const mihirBackend = MIHIR_BACKEND
//  || "http://localhost:3000"; // default fallback