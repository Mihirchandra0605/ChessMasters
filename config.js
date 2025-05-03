import { config } from "dotenv";

// Load environment variables from .env file
config();

const {
MIHIR_BACKEND
  } = process.env;

export const mihirBackend = MIHIR_BACKEND || "http://localhost:3000"; // default fallback